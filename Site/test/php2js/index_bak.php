<?php
function testRequest($action,$requestBody){
    $ch = curl_init();
    $timeout = 5;
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", 'Content-Length: ' . strlen($requestBody)));
    curl_setopt($ch, CURLOPT_URL,  $action);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $data = curl_exec($ch);
    curl_close($ch);
    var_dump($data);
    // parse as JSON
    $result = json_decode($data);
    return $result;
}
function processRequest($url, $postFields, $referer)
{
    $ret = "";
    $ch = curl_init();

//    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", 'Content-Length: ' . strlen($requestBody)));

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, "");
    if (!is_null($postFields)) {
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            $postFields);
        // http_build_query() will properly escape the fields and
        //  build a query string.
    }


    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_REFERER, $referer);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    //curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);


    $ret = curl_exec($ch);

    curl_close($ch);

    return $ret;
}

$url = "https://api.staging.payfone.com/mobileauth/2013/01/28/".$_REQUEST["action"];

//OriginatingClientIp: clientIp,
//        UserAgent: userAgent,
//        IsMobileApp: false,
//        RequestId : requestId,
//        ApiClientId: this.merchantId

$post = array();
$post["OriginatingClientIp"]=$_REQUEST["OriginatingClientIp"];
$post["UserAgent"]=$_REQUEST["UserAgent"];
$post["IsMobileApp"]=$_REQUEST["IsMobileApp"];
$post["RequestId"]=$_REQUEST["RequestId"];
$post["ApiClientId"]=$_REQUEST["ApiClientId"];
$requestBody = json_encode($post);
//var_dump($requestBody); die;
$ret = processRequest($url, $requestBody,"");

//echo $ret;
echo "jsonpcallback(".$ret.")";

