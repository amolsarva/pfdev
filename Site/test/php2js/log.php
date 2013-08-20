<?php header("Refresh: 3600;url=http://payfone.snkpk.com/test/php2js/log.php"); ?>

<?php
require('access.php');
?>

<?php

$con=mysqli_connect("mysql.payfone.snkpk.com","payfone","rodger2013","payfone_log");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

$query = "SELECT * FROM whitelist WHERE IP='ALL'";
$num = mysqli_num_rows(mysqli_query($con,$query));

echo '<form action="/test/php2js/whitelist.php" method="POST"><br>', 'Password:<input type="text" name="pass" /><br>';
echo 'IP:<input type="text" name="IP" /><br>', '<input type="submit"/>', '</form>';

echo '<form action="/test/php2js/whitelist.php" method="POST"><br>', 'Password:<input type="text" name="pass" /><br>';

if ($num > 0)
{
	echo '<input type="submit" value="IP Limiter is OFF" style="background-color:red;color:white"/>';
}
else
{
	echo '<input type="submit" value="IP Limiter is ON" style="background-color:green;color:white"/>';
}
echo '</form>';

$today = getdate();
$query = "SELECT * FROM calls WHERE day='".$today[mon]."/".((int) ($today[mday]/10)).($today[mday]%10)."/".$today[year]."'";
$res = mysqli_query($con,$query);

echo "<table style='text-align:center'>";
echo "<tr><td>ID Number</td><td>&nbsp;</td><td>IP Address</td><td>&nbsp;</td><td>Number Requested</td><td>&nbsp;</td><td>Date</td><td>&nbsp;</td><td>Time</td><td>&nbsp;</td><td>Status Code</td><td>&nbsp;</td><td>Blocked?</td></tr>";
while($arr = mysqli_fetch_assoc($res)) {
	echo "<tr>";
	foreach($arr as $elt) {
	    echo "<td>",$elt,"</td>","<td>&nbsp;</td>";
	}
	echo "</tr>";
}
echo "</table>";

mysqli_close($con);

?>