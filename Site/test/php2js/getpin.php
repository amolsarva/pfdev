<?php

define ("MAX_LOG_SIZE",1*1024*1024);
function WriteToLog($logFileName,$msg, $skip=false)
{
  $name=$logFileName;
  if ($skip)
  {
   @unlink($name);
  }
  if (defined("MAX_LOG_SIZE"))
  {
   if (@strlen(file_get_contents($name))>MAX_LOG_SIZE)
    @unlink($name);
  }
  $file=@fopen($name,"a");
  if ($file)
  {

   if ($skip)
    fwrite($file,$msg);
   else
    fwrite($file,@date("d.m.Y H:i:s")."\t".$msg."\r\n");
   fclose($file);
  }
}


function ReadPageCURL($url,$cookie="",$referrer="",$proxy="",$retry=3)
{
 $s="";
 for ($i=0; ($i<$retry)&&(strlen($s)<=0); $i++)
 {
//   if ($i>0) if (!defined("LOCAL_SITE")) sleep(1); // sleep 1 second
   if ($curl = @curl_init())
   {
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
    curl_setopt($curl,CURLOPT_URL,$url);
  //  curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl,CURLOPT_TIMEOUT,30);
    curl_setopt($curl,CURLOPT_MAXREDIRS,5);
    @curl_setopt($curl,CURLOPT_FOLLOWLOCATION,true);
    $agent="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0";
    curl_setopt($curl,CURLOPT_USERAGENT,$agent);
//    curl_setopt($curl,CURLOPT_COOKIEJAR, $cookie);
//    curl_setopt($curl,CURLOPT_COOKIEFILE, $cookie);
//    curl_setopt($curl,CURLOPT_ENCODING,'gzip');
//    if (strlen($proxy)>0)      curl_setopt($curl, CURLOPT_PROXY, "$proxy");
    if (strlen($referrer)>0)
     curl_setopt($curl, CURLOPT_REFERER,$referrer);
    $s = @curl_exec($curl);
  //if (defined("DEBUG_CURL")) echo "<br>----------------------------------------------<br>URL: $url<br>$agent<br>$referrer<br>$proxy<br>$s<br>----------------------------------------------<br>";
    @curl_close($curl);
    unset($curl);
   }
 }
 return $s;
}

function getPin($merchantId, $activationTransactionId, $requestId)
{
    $url = "https://partners.staging.payfone.com/p3util/getPin?merchid=" . $merchantId . "&txid=" . $activationTransactionId . "&reqid=" . $requestId . "&fmt=json";
    // parse as JSON
    $s = ReadPageCURL($url);
    $result = @json_decode($s, true);

    // return the 'smspin' parameter
    return @$result['smspin'];
}
$mid=@$_GET["mid"];
$aid=@$_GET["aid"];
$rid=@$_GET["rid"];
//echo @json_encode(array("pin"=> ));
$pin=getPin($mid,$aid,$rid);
WriteToLog(getcwd()."/getpin_log.txt","pin = $pin, mid = $mid, aid=$aid, rid=$rid");
echo "jsonpcallback('".$pin."')";
?>