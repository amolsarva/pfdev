<?php

$password = '9b279b815e26b259a7c7d8f9e220a2e5adccc822';
if (sha1(@$_REQUEST["pass"]) == $password)
{
	$con=mysqli_connect("mysql.payfone.snkpk.com","payfone","rodger2013","payfone_log");
	// Check connection
	if (mysqli_connect_errno())
	  {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	  }
       if (mysqli_real_escape_string($con,@$_REQUEST["IP"]) == "")
       {
		$query = "SELECT * FROM whitelist WHERE IP='ALL'";
		$num = mysqli_num_rows(mysqli_query($con,$query));

		if ($num == 1)
		{
			$query = "DELETE FROM whitelist WHERE IP='ALL'";
			mysqli_query($con,$query);			
		}
		else
		{
			$query = "INSERT INTO whitelist (IP) VALUES ('ALL')";
			mysqli_query($con,$query);
		}

       }
       else
       {	
	$query = "SELECT * FROM whitelist WHERE IP='".mysqli_real_escape_string($con,@$_REQUEST["IP"])."'";
	$num = mysqli_num_rows(mysqli_query($con,$query));
	
	if ($num < 1)
	{
		$query = "INSERT INTO whitelist (IP)
		VALUES ('".mysqli_real_escape_string($con,@$_REQUEST["IP"])."')";
		
		mysqli_query($con,$query);
	}
	}

	$query = "SELECT * FROM whitelist WHERE IP!='ALL'";
	$res = mysqli_query($con,$query);

	echo "<table style='text-align:center'>";
	echo "<tr><td>ID Number</td><td>&nbsp;</td><td>IP Address</td></tr>";
	while($arr = mysqli_fetch_assoc($res)) {
		echo "<tr>";
		foreach($arr as $elt) {
		    echo "<td>",$elt,"</td>","<td>&nbsp;</td>";
		}
		echo "</tr>";
	}
	echo "</table>";
	
	mysqli_close($con);
}
else
{
echo "Incorrect password.";
}

?>