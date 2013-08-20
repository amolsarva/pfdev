var MERCHANT_ID = "LL6312864b57c87bb";
var SUB_MERCHANT_ID = "Test Merchant";
var MERCHANT_ALIAS = "Merchant Inc.";
var REQUESTID_PREFIX = "MER";


function MobileAuthJSONClient(merchantId, merchantAlias) {
    this.trace=true; // this.trace=false
    this.merchantId = merchantId;
    this.merchantAlias = merchantAlias;
    this.SubClientId=SUB_MERCHANT_ID;
    this.url = "http://api.1linx.com/rest/identity/v1/mobileIdentity.php";
    // functions
    this.getTypes = getAuthenticationTypes;
    this.goRedirect = authenticateByRedirect;
    this.log=logMessage;
    this.send=sendRequest;
}

function logMessage(message)
{
 if (!this.trace) return;
 var msg=message.replace("\n","<br/>");
 var s=$("#log_div").html()+msg+"<br/>";
 $("#log_div").html(s);
}
function jsonpcallback(data) {
    alert('success' + data);
}

function sendRequest(action,postData)
{
  var sendURL=this.url+action;
  this.log(action+" - send request: \n"+sendURL+"\n"+postData);
  var client=this;
  var res="";
//  alert("postData:\n"+postData);
  $.ajax({
/*
    headers: {

    },
*/
    type: 'POST',
    url: sendURL,
//    contentType: "application/jsonp",
    dataType: "jsonp",
    jsonp : "callback",
    jsonpCallback: "jsonpcallback",
    data: postData,
    async : false,
    success: function(data){
      res = data;
      client.log(action+" - reply:\n"+data);
    },

   error: function (xhr, ajaxOptions, thrownError) {
        client.log(action+" - ERROR: status = "+xhr.status+"\n"+thrownError);
   }
  });
  var seconds = new Date().getTime() / 1000;
  while ((res.length<=0) && ((new Date().getTime() / 1000) - seconds) < 5) ;
  return res;
}

function authenticateByRedirect(requestIdPrefix, redirectUrl) {
//alert("go redirect \nrequestIdPrefix="+requestIdPrefix+"\nredirectUrl = "+redirectUrl);

  var jsonObj = {
            FinalTargetUrl: redirectUrl,
            RequestId : requestId,
            ApiClientId: this.merchantId
                 }
  var postData = JSON.stringify(jsonObj);
  var res=this.send("authenticateByRedirect",postData);
  return res;
}

function getAuthenticationTypes(requestId, clientIp, userAgent) {
  var jsonObj = {
            OriginatingClientIp: clientIp,
            UserAgent: userAgent,
            IsMobileApp: false,
            RequestId : requestId,
            ApiClientId: this.merchantId
                 }
  var postData = JSON.stringify(jsonObj);
  var res=this.send("getAuthenticationTypes",postData);
  return res;
}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function getIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

function uniqid(s)
{
 var n=Math.floor(Math.random()*11);
 var k = Math.floor(Math.random()* 1000000);
 var m = s+String.fromCharCode(n)+k;
 return m;
}

function test()
{
// alert("test");
 var ip=getIP();
// alert("ip="+ip);
 var client = new MobileAuthJSONClient(MERCHANT_ID,MERCHANT_ALIAS);
 var renderMobile =  (parseInt(getURLParameter('renderMobile')) > 0)? true :  false;
 var requestIdPrefix = REQUESTID_PREFIX;
 var agent = navigator.userAgent;
// alert("agent="+agent+"\nip="+ip+"\nmerchantID="+MERCHANT_ID+"\nmerchantAlias="+MERCHANT_ALIAS+"\nclient="+client+"\nrenderMobile="+renderMobile+'requestIdPrefix='+requestIdPrefix);
 try
 {
  // Pass the GetAuthenticationTypes method the IP address and User-Agent of the end user's handset
  var result = client.getTypes(uniqid(requestIdPrefix), ip, agent);
//  alert("result = "+result);
  var s=""+result;
  if (s.search("Redirect")>=0)
//if (1)
  {
   	// Call authenticateByRedirect passing the return URL
    var redirectUrl = window.location.href;
    var p=redirectUrl.search("\\?");
    if (p>=0)
     redirectUrl=redirectUrl.substring(0, p-1);
    for (i=redirectUrl.length-1; i>=0; i--)
     if (redirectUrl[i]=="\/")
     {
      redirectUrl=redirectUrl.substring(0, i-1);
      break;
     }
    redirectUrl+="/authenticateByRedirectFinish.php?renderMobile="+renderMobile;
    var result1 = client.goRedirect(uniqid(requestIdPrefix), redirectUrl);
//alert("result1="+result1);
    if (result1[0] != 1)
    {
     alert("Unsuccessful response from authenticateByRedirect\n"+result1[1]);
    }
    else
    {
     window.location = result1[1];
    }
  }
  else
  {
   alert("Redirect not supported for this device, result = "+result);
  }
 }
 catch(err)
 {
  alert("Errors: "+err);
 }
// alert("test finished");
}