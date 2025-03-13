/*******************************
[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/.+$) url script-response-body https://raw.githubusercontent.com/afengye/QX/main/crack.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-header https://raw.githubusercontent.com/afengye/QX/main/crack.js
[mitm] 
hostname = api.revenuecat.com,api.rc-backup.com
*******************************/
let obj = {};

if(typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  obj.headers = $request.headers;
}else {
  let body = JSON.parse(typeof $response != "undefined" && $response.body || null);
  if(body && body.subscriber) {
    let date = {"expires_date": "2999-01-01T00:00:00Z","original_purchase_date":"2021-01-01T00:00:00Z","purchase_date": "2021-01-01T00:00:00Z","ownership_type": "PURCHASED","store": "app_store"};
    let subscriber = body.subscriber;
    const newObj = Object.fromEntries(Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v]));
    let bundle_id = newObj["x-client-bundle-id"]?newObj["x-client-bundle-id"]:newObj["user-agent"].match(/^[%a-zA-Z0-9]+/)[0];
    const list = [
      {"app_name":"Days","bundle_id":"net.mattdavenport.daysuntil","product_id":"net.mattdavenport.daysuntil.dayspremiumlifetime","entitlements":["premium","pro"],"version":"3.15"},
      {"app_name":"iHabit","bundle_id":"com.gostraight.iHabit","product_id":"ihabit_forever_payment_vip","entitlements":["ihabit_lTime_subscription","ihabit_subscription_pro"],"version":"1.0.25"},
      {"app_name":"记一杯","bundle_id":"me.xgmm.markacup","product_id":"202403180021","entitlements":["premiun"],"version":"1.5.4"},
   ];  
   for(let data of list){
     if(bundle_id == data.bundle_id || bundle_id == data.app_name){
       let product_id = data.product_id;
       let entitlements = data.entitlements;
       subscriber.subscriptions[(product_id)] = date;
       for (let entitlement of entitlements) {
         subscriber.entitlements[(entitlement)] = date;        
         subscriber.entitlements[(entitlement)].product_identifier = product_id; 
       }
       break; 
     }   
   }
   obj.body = JSON.stringify(body);
  }
}

$done(obj);
