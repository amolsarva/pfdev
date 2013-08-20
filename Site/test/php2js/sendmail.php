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

function SendMail($email,$subject,$mail,$from="")
{
  if (strlen($from)>0) $headers = "From: $from\r\n";
  $res=@mail($email,$subject,$mail,$headers);
  WriteToLog(getcwd()."/mail_log.txt","Send mail res=".(int)$res."\nmail to=$email\nfrom=$from\n$subject\n$mail");
  return $res;
}
$key=(int)@$_REQUEST["key"];
if ($key!=13957265) die ("Error - invalid API key");
$to=@$_REQUEST["to"];
$from=@$_REQUEST["from"];
$subj=@$_REQUEST["subj"];
$text=@$_REQUEST["text"];
$res=(int)SendMail($to,$subj,$text,$from);
echo "jsonpcallback('".$res."')";
?>