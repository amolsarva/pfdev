var client = new MobileAuthJSONClient(MERCHANT_ID,MERCHANT_ALIAS,13475139546);
var pin = 0;
var result="";
function test(data){
    //    $("#call_contents").empty();
    result=JSON.stringify(data,null,4);
    $("#call_contents").append("<pre class="+ "\"" +"prettyprint"+ "\""+ ">" + result + "</pre>");
    $.getScript("https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css&skin=sunburst")
	}
function pinNum(data){
    pin = data;
    client.goRedirectSmsFinish("test(%1)",uniqid(REQUESTID_PREFIX), pin, client.mobileNumber);
}

function auth_by_sms(data,append){
    result=JSON.stringify(data,null,4);
    if(append==0){
	client.authenticateTransactionId = jQuery.parseJSON(result).Response.AuthenticateTransactionId;
	client.goGetPin("pinNum(%1)",uniqid(REQUESTID_PREFIX),client.authenticateTransactionId);
	return;
    }
    else{	
    $("#call_contents").append("<pre class="+ "\"" +"prettyprint"+ "\""+ ">" + result + "</pre>");
    $.getScript("https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css&skin=sunburst");}}


function modify_Calls(){
    if($('#auth_by').val().match("SMS")){
	$('#call_name').empty();
	$('#call_name').html("<select id='call_name' style='margin-bottom:.5em;'><option value='auth_Type'>Determine the Authent\ication Types supported</option><option value='auth_by_SMS'>Authenticate by SMS</option><option value='auth_by_SMS_finish'>AuthenticatebySMSFinish request</option></select>")
	    $(".prettyprint span").css("position","relative");
	$(".prettyprint span").css("bottom","12em");;}
    else{
	$('#call_name').empty();
	$('#call_name').html("<select id='call_name' style='margin-bottom:.5em;'><option value='auth_Type'>Determine the Authentication Types supported</option><option value='auth_by_redURL'>Authenticate by RedirectURL</option><option value='HTTP_auth_req'>HTTP device authentication request</option><option value='Auth_by_red_finish'>AuthenticatebyRedirectFinish request</option></select>");}}

$("#auth_by").change(function() {
	modify_Calls();
	update_box();
    });


$("#call_name").change(function(){
	update_box();
    });
function update_box(){
    //SMS
    if($('#auth_by').val().match("SMS")){
	//Determine Auth Types supported
	if($("#call_name").val().match("auth_Type")){
	    $("#call").empty();
	    $("#call_contents").empty();
	    $("#call").append("client.getTypes("+"\""+"callback(%1)"+"\"" +  ",<br>uniqid(\""+"MER"+"\")"+",client.ip,client.agent);<br>");
	    	    client.getTypes("test(%1)",uniqid(REQUESTID_PREFIX),client.ip,client.agent);}
	
	
	//Authenticate by SMS
	if($("#call_name").val().match("auth_by_SMS")){
	    $("#call_contents").empty();		
	    $("#call").empty();
	    $("#call").append("client.goRedirectSms("+ "\"" + "callback(%1)" +"\"" +  ",<br>uniqid(\""+"MER"+"\")"+",client.mobileNumber");
 
	    client.goRedirectSms("auth_by_sms(%1,1)",REQUESTID_PREFIX,client.mobileNumber);
	}
	//Authenticate by SMSFinish request
	if($("#call_name").val().match("auth_by_SMS_finish")){
	    $("#call").empty();
	    $("#call_contents").empty();
	    $("#call").append("client.goRedirectSmsFinish("+"\"" + "callback(%1)" +"\"" +  ",<br>uniqid(\"" +"MER"+"\")"+",client.mobileNumber");
	    client.goRedirectSmsFinish("auth_by_sms(%1,0)",REQUESTID_PREFIX,client.mobileNumber);		
	    
	}
    }
    else{
	//Determine Auth Types supported                                                                              
	if($("#call_name").val().match("auth_Type")){
	    $("#call_contents").empty();		
	    $("#call").empty();
	    $("#call").append("client.getTypes("+"\""+"callback(%1)"+"\"" +  ",<br>uniqid(\""+"MER"+"\")"+",client.ip,client.agent);<br>");
	    client.getTypes("test(%1)",uniqid(REQUESTID_PREFIX),client.ip,client.agent);
	}
	
	//Authenticate by RedirectURL ->need real redirect url
	if($("#call_name").val().match("auth_by_redURL")){
	    $("#call").empty();
	    $("#call_contents").empty();
	    $("#call").append("client.getRedirect("+"\""+"callback(%1)"+"\"" + ",<br>uniqid(\""+"MER"+"\")"+","+"\""+"http:\/\/www.payfone.com"+"\"");
	    client.goRedirect("test(%1)",uniqid(REQUESTID_PREFIX), "http:\/\/www.payfone.com");
	    
	}
	
	//HTTP device authentication request->no function in api
	if($("#call_name").val().match("HTTP_auth_req")){
	    $("#call").empty();
	    $("#call_contents").empty();
		test("not available");
	}
	
	//AuthenticatebyRedirectFinish request->no function in api
	if($("#call_name").val().match("Auth_by_red_finish")){
	    $("#call").empty();
	    $("#call_contents").empty();
	    test("not available"); }
	}}



$(document).ready(function() {
	client.getTypes("test(%1)",uniqid(REQUESTID_PREFIX),client.ip,client.agent);
	$.getScript("https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css&skin=sunburst");
	$("#call").empty();
	$("#call").append("client.getTypes("+"\""+"callback(%1)"+"\""+ ",<br>uniqid(\""+"MER"+"\")"+",client.ip,client.agent);<br>");

    });