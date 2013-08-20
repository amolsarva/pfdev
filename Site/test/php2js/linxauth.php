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

$con=mysqli_connect("mysql.payfone.snkpk.com","payfone","rodger2013","payfone_log");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

$query = "SELECT * FROM whitelist WHERE IP='".$_SERVER['REMOTE_ADDR']."'";
$num = mysqli_num_rows(mysqli_query($con,$query));

$query = "SELECT * FROM whitelist WHERE IP='ALL'";
$num += mysqli_num_rows(mysqli_query($con,$query));

$today = getdate();
$query = "SELECT * FROM calls WHERE day='".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."' AND IP='".$_SERVER['REMOTE_ADDR']."'";
$lastday = mysqli_num_rows(mysqli_query($con,$query));


$query = "SELECT * FROM calls WHERE day='".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."' AND time='".$today[hours].":".((int) ($today[minutes]/10)).($today[minutes]%10)."' AND IP='".$_SERVER['REMOTE_ADDR']."'";
$lastmin = mysqli_num_rows(mysqli_query($con,$query));

if (($lastday < 5 and $lastmin < 1) or ($num > 0)){
$l="http://api.1linx.com/rest/identity/v1/mobileIdentity.php?clientId=LL6312864b57c87bb&msisdn=" . @$_REQUEST["msisdn"] . "&requestId=1linx_" . rand(1,999999);
//WriteToLog("log_linx.txt","l = $l");
$res=file_get_contents($l);
$res=str_replace("\n","",$res);
$res=str_replace("\r","",$res);
$res=str_replace("'","\"",$res);
//WriteToLog("log_linx.txt","res = $res");
echo "jsonpcallback('".$res."')";

$data = json_decode($res, TRUE);

$query = "INSERT INTO calls (IP, number, day, time, code, blocked)
VALUES ('".$_SERVER['REMOTE_ADDR']."', '".mysqli_real_escape_string($con,@$_REQUEST["msisdn"])."', '".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."', '".$today[hours].":".((int) ($today[minutes]/10)).($today[minutes]%10)."', '".$data["Response"]["StatusCode"]."', 'NO')";

mysqli_query($con,$query);
} elseif ($lastday >= 5) {

$query = "INSERT INTO calls (IP, number, day, time, code, blocked)
VALUES ('".$_SERVER['REMOTE_ADDR']."', '".mysqli_real_escape_string($con,@$_REQUEST["msisdn"])."', '".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."', '".$today[hours].":".((int) ($today[minutes]/10)).($today[minutes]%10)."', '".$data["Response"]["StatusCode"]."', 'YES-D')";

mysqli_query($con,$query);

echo "jsonpcallback('{\"Response\":\"Day\"}')";
} else {

$query = "INSERT INTO calls (IP, number, day, time, code, blocked)
VALUES ('".$_SERVER['REMOTE_ADDR']."', '".mysqli_real_escape_string($con,@$_REQUEST["msisdn"])."', '".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."', '".$today[hours].":".((int) ($today[minutes]/10)).($today[minutes]%10)."', '".$data["Response"]["StatusCode"]."', 'YES-M')";

mysqli_query($con,$query);

echo "jsonpcallback('{\"Response\":\"Min\"}')";
}

mysqli_close($con);

?>