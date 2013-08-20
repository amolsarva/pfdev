<?php
session_start();
echo "<br/>REQUEST_count = ".count($_REQUEST);
$i=0;
foreach ($_REQUEST as $k=>$v)
{
 if (is_array($v) )
{
 echo "<br>REQUEST[$i]  $k=<br/>";
 print_r($v);
}
else
 echo "<br>REQUEST[$i]  $k=$v";
 $i++;
}

echo "<br/>COOKIE_count = ".count($_COOKIE);
$i=0;
foreach ($_COOKIE as $k=>$v)
{
 echo "<br>COOKIE[$i]  $k=$v";
 $i++;
}

echo "<br/>SESSION_count = ".count($_SESSION);
$i=0;
foreach ($_SESSION as $k=>$v)
{
 echo "<br>SESSION[$i] $k=$v";
 $i++;
}

?>