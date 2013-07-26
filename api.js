// common
var debugTraceAPI=false;
var CurLocation=""+window.location;
// payfone
var MERCHANT_ID = "Sarva0bB93g0sX50mC7";
var SUB_MERCHANT_ID = "Test Merchant";
var MERCHANT_ALIAS = "Merchant Inc.";
var REQUESTID_PREFIX = "MER";
var URL_REDIRECT = "http://payfone.snkpk.com/test/php2js/redirect.php";
var URL_GETPIN = "http://payfone.snkpk.com/test/php2js/getpin.php";
var URL_SENDMAIL = "http://payfone.snkpk.com/test/php2js/sendmail.php";
// linx
var LINX_CLIENT_ID="LL6312864b57c87bb";
var LINX_URL="http://api.1linx.com/rest/identity/v1/mobileIdentity.php?";
var URL_LINX_AUTH="http://payfone.snkpk.com/test/php2js/linxauth.php?";
var client=null;

function _is_number(val) { var re = /^[0-9]+$/; return re.test(val); }
function _is_email(val) { var re = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/; return re.test(val); }

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function getIP() {
    var res="";
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

   hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) {
         res=ipAddress[1];
         return res.trim();
        }
    }
    return res;
}

function uniqid(s)
{
    var k = Math.floor(Math.random()* 1000000);
    var m = s+k;
    return m;
}

function encodeValue(val)
{
 var encodedVal;
 if (!encodeURIComponent)
 {
   encodedVal = escape(val);
   /* fix the omissions */
   encodedVal = encodedVal.replace(/@/g, '%40');
   encodedVal = encodedVal.replace(/\//g, '%2F');
   encodedVal = encodedVal.replace(/\+/g, '%2B');
 }
 else
 {
   encodedVal = encodeURIComponent(val);
   /* fix the omissions */
   encodedVal = encodedVal.replace(/~/g, '%7E');
   encodedVal = encodedVal.replace(/!/g, '%21');
   encodedVal = encodedVal.replace(/\(/g, '%28');
   encodedVal = encodedVal.replace(/\)/g, '%29');
   encodedVal = encodedVal.replace(/'/g, '%27');
 }
 /* clean up the spaces and return */
 return encodedVal.replace(/\%20/g,'+');
}

function MobileAuthJSONClient(merchantId, merchantAlias, mobileNum) {
    this.trace=debugTraceAPI;
    this.merchantId = merchantId;
    this.merchantAlias = merchantAlias;
    this.SubClientId=SUB_MERCHANT_ID;
    this.url = URL_REDIRECT;
    this.urlPin = URL_GETPIN;
    this.urlSendMail = URL_SENDMAIL;
    this.mobileNumber = mobileNum;
    this.ip=getIP();
    this.renderMobile = (parseInt(getURLParameter('renderMobile')) > 0)? true : false;
    this.agent = navigator.userAgent;
    this.authenticateTransactionId="";
    // functions
    this.getTypes = getAuthenticationTypes;
    this.goRedirect = authenticateByRedirect;
    this.goRedirectSms = authenticateBySms;
    this.goGetPin = getPin;
    this.goRedirectSmsFinish = authenticateBySmsFinish;
    this.goSendMail = sendMail;
    this.goAuthLinx = authLinx;
    this.goAuth = auth;
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
}

function sendRequest(callback,action,postData)
{
    var sendURL=this.url;
    this.log("Request: <br>action="+action+"<br>requestBody: <br>"+JSON.stringify(postData));
    var client=this;
    var res="";
    try
    {
      postData["action"]=action;
      $.ajax({
          type:           'GET',
          url:            sendURL,
          jsonpCallback:  "jsonpcallback",
          data:           postData,
          dataType:       'JSONP', // this line was missing
          async :         true,
          success:        function(data){
            client.log(action+" - reply:\n"+JSON.stringify(data));
            res=JSON.stringify(data);
            eval(callback.replace("%1",res));
          },
          error: function (xhr, ajaxOptions, thrownError) {
            client.log(action+" - ERROR: status = "+xhr.status+"\n"+thrownError+"\n"+xhr.responseXML);
            res="err";
            eval(callback.replace("%1",res));
          }
      });
    }
    catch(err)
    {
      eval(callback.replace("%1","Exception: "+err));
    }
}


function getPin(callback, requestIdPrefix, transactionID)
{
  this.log("GetPin Request: <br>transactionID="+transactionID+"<br>requestIdPrefix="+requestIdPrefix);
  var client=this;
  var sendURL=client.urlPin+"?mid="+this.merchantId+"&aid="+transactionID+"&rid="+requestIdPrefix;
  $.ajax({
          type:           'GET',
          url:            sendURL,
          async :         true,
          dataType:       'JSONP', // this line was missing
          jsonpCallback:  "jsonpcallback",
          success:        function(data){
            client.log("GetPin  - reply:\n"+data);
            eval(callback.replace("%1",data));
          },
          error: function (xhr, ajaxOptions, thrownError) {
            client.log("GetPin  - ERROR: status = "+xhr.status+"\n"+thrownError+"\n"+xhr.responseText);
            res="err";
            eval(callback.replace("%1",res));
          }
      });
}

function sendMail(callback, sendTo, sendFrom, sendSubj, sendText )
{
  this.log("SendMail Request: <br>sendTo="+sendTo+"<br>sendFrom="+sendFrom+"<br>sendSubj="+sendSubj+"<br>sendText"+sendText);
  var client=this;
  var sendURL=client.urlSendMail+"?key=13957265&to="+encodeValue(sendTo)+"&from="+encodeValue(sendFrom)
              +"&subj="+encodeValue(sendSubj)+"&text="+encodeValue(sendText);
  $.ajax({
          type:           'GET',
          url:            sendURL,
          async :         true,
          dataType:       'JSONP', // this line was missing
          jsonpCallback:  "jsonpcallback",
          success:        function(data){
            client.log("SendMail  - reply:\n"+data);
            eval(callback.replace("%1",data));
          },
          error: function (xhr, ajaxOptions, thrownError) {
            client.log("SendMail  - ERROR: status = "+xhr.status+"\n"+thrownError+"\n"+xhr.responseText);
            res="err";
            eval(callback.replace("%1",res));
          }
      });
}

function authenticateByRedirect(callback, requestIdPrefix, redirectUrl) {
    var jsonObj = {
        RequestId : requestIdPrefix,
        ApiClientId: this.merchantId,
        FinalTargetUrl: redirectUrl
    }
    var postData = jsonObj;
    this.send("authenticateByRedirect",postData,callback);
}

function authenticateBySms(callback, requestIdPrefix, mobilePhone) {
    var jsonObj = {
        RequestId: requestIdPrefix,
        ApiClientId: this.merchantId,
        MobileNumber: mobilePhone
    }
    var postData = jsonObj;
    this.send(callback,"authenticateBySms",postData);
}

function authenticateBySmsFinish(callback, requestIdPrefix, pin, transactionID) {
    var jsonObj = {
        RequestId: requestIdPrefix,
        ApiClientId: this.merchantId,
        Passcode: pin,
        AuthenticateTransactionId: transactionID
    }
    var postData = jsonObj;
    this.send(callback,"authenticateBySmsFinish",postData);
}

function getAuthenticationTypes(callback, requestId, clientIp, userAgent) {
    var jsonObj = {
        RequestId : requestId,
        ApiClientId: this.merchantId,
        OriginatingClientIp: clientIp,
        UserAgent: userAgent,
        IsMobileApp: false
    }
    var postData = jsonObj;
    this.send(callback,"getAuthenticationTypes",postData);
}

function authLinx(callback)
{
 var link=LINX_URL+"clientId="+LINX_CLIENT_ID+"&msisdn="+this.mobileNumber+"&requestId="+uniqid('1linx_');
 var sendURL=URL_LINX_AUTH+"link="+encodeValue(link);
  $.ajax({
          type:           'GET',
          url:            sendURL,
          async :         true,
          dataType:       'JSONP', // this line was missing
          jsonpCallback:  "jsonpcallback",
          success:        function(res){
             eval(callback.replace("%1",res));
          },
          error: function (xhr, ajaxOptions, thrownError) {
             eval(callback.replace("%1","ERROR "+thrownError));
          }
      });
}

function auth(callback,step,result)
{
//alert("step="+step+"\nresult="+result+"\nMobileNumber="+client.mobileNumber);
    if (step<=0)
     // Pass the GetAuthenticationTypes method the IP address and User-Agent of the end user's handset
     client.getTypes("client.goAuth('"+callback+"',1,'%1')", uniqid(REQUESTID_PREFIX), client.ip, client.agent);
    else
    if (step==1)
    {
     if (result.search("Redirect")>=0)
     {
      var redirectUrl = "http:\/\/www.payfone.com";
      client.goRedirect("client.goAuth('"+callback+"',2,'%1')", uniqid(REQUESTID_PREFIX), redirectUrl);
     }
     else
     if (result.search("Sms")>=0)
     {
//alert(MobileNumber);
      client.goRedirectSms("client.goAuth('"+callback+"',3,'%1')", uniqid(REQUESTID_PREFIX), client.mobileNumber);
     }
     else
      client.goAuthLinx(callback+"('%1')");
    }
    else
    if (step==2)
    {
     // redirect finish
     // window.location = result ?
     eval(callback+"('"+result+"')");
    }
    else
    if (step==3)
    {
     // sms transaction id
     if (result.search("AuthenticateTransactionId")>=0) {
      client.authenticateTransactionId = jQuery.parseJSON(result).Response.AuthenticateTransactionId;
      client.goGetPin("client.goAuth('"+callback+"',4,'%1')", uniqid(REQUESTID_PREFIX), client.authenticateTransactionId)
     }
     else
      client.goAuthLinx(callback+"('%1')");
    }
    else
    if (step==4)
    {
     client.goRedirectSmsFinish("client.goAuth('"+callback+"',5,'%1')",uniqid(REQUESTID_PREFIX), result, client.mobileNumber);
    }
    else
    if (step==5)
    {
     if (result.search("Success.")>=0)
      eval(callback+"('"+result+"')");
     else
      client.goAuthLinx(callback+"('%1')");
    }
} // auth

// callback: <function name>
// function name with 1 parameter - result
// mobilenumber - number of mobile phone
function AuthPayfoneLinx(callback,mobilenumber)
{
 if (!client)
  client = new MobileAuthJSONClient(MERCHANT_ID,MERCHANT_ALIAS,mobilenumber);
 client.goAuth(callback,0,'');
}