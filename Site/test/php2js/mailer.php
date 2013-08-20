<?php

if (sha1(@$_REQUEST["pass"]) == "9b279b815e26b259a7c7d8f9e220a2e5adccc822")
{
	$con=mysqli_connect("mysql.payfone.snkpk.com","payfone","rodger2013","payfone_log");

	$today = getdate();
	$query = "SELECT * FROM calls WHERE day='".(int) date("m", strtotime("yesterday")) .date("/d/Y", strtotime("yesterday"))."'";
	$res = mysqli_query($con,$query);
	
	$s = "<table style='text-align:center'>";
	$s .= "<tr><td>ID Number</td><td>&nbsp;</td><td>IP Address</td><td>&nbsp;</td><td>Number Requested</td><td>&nbsp;</td><td>Date</td><td>&nbsp;</td><td>Time</td><td>&nbsp;</td><td>Status Code</td><td>&nbsp;</td><td>Blocked?</td></tr>";
	while($arr = mysqli_fetch_assoc($res)) {
		$s .= "<tr>";
		foreach($arr as $elt) {
		    $s .= "<td>".$elt."</td><td>&nbsp;</td>";
		}
		$s .= "</tr>";
	}
	$s .= "</table>";

	mysqli_close($con);

       require "class.phpmailer.php";
	$mail = new PHPMailer();
			
	$mail->IsSMTP();                                      // set mailer to use SMTP
	$mail->Host = "mail.payfone.snkpk.com";  // specify main and backup server
	$mail->Port = 587; 
	$mail->SMTPAuth = true;     // turn on SMTP authentication
        $mail->Username = "log-mailer@payfone.snkpk.com";        // Make sure to replace this with your shell enabled user
        $mail->Password = "rodger2013";      // Make sure to use the proper password for your user
	
 		
	$mail->From = "log-mailer@payfone.snkpk.com";
	$mail->FromName = "Log Mailer";
	$mail->AddAddress("lglatimer@gmail.com", "Laurence Latimer");
	$mail->AddAddress("a@sarva.co", "Amol Sarva");
			
	$mail->WordWrap = 50;                                 // set word wrap to 50 characters
	$mail->IsHTML(true);                                  // set email format to HTML
			
	$mail->Subject = "Yesterday's Log";
	$mail->Body    = $s;
						
	if(!$mail->Send()){
		echo "Message could not be sent. <p>";
		echo "Mailer Error: " . $mail->ErrorInfo;
		exit;
	}
}

?>