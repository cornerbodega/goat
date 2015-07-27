<?php
ob_start();
include "php/db/database.php";
$passed = false;

    if(empty($_POST['email']))
    {
        echo("Please enter email");
        return false;
    }
     
    if(empty($_POST['password']))
    {
        echo("Please enter password");
        return false;
    }
    
    if(empty($_POST['ubi']))
    {
        echo("Please enter ubi");
        return false;
    }
     
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $ubi = trim($_POST['ubi']);
     
     
    session_start();
     
     

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://wslcb.mjtraceability.com/serverjson.asp",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\"API\": \"4.0\",\n\"action\": \"login\",\n\"password\":\"".$password."\",\n\"license_number\":\"".$ubi."\",\n\"username\":\"".$email."\"\n}",
  CURLOPT_HTTPHEADER => array(
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);
$j = json_decode($response, true);
if($j['success'] == "1") {
    $passed = true;
} else { 
    echo "Login Failed";
}
$session = $j['sessionid'];
$response = json_encode($j);
curl_close($curl);
if ($err) {
  echo "cURL Error #:" . $err . "\nsupport@marvin.technology";
} else {
  //echo $response;
}
setcookie("email", $email);
$url = "app.html";
if ($passed) {

    $conn = new mysqli($host, $dbun, $dbpw, $sessions_db);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
    echo "Connected successfully";

    $sql = "INSERT INTO `".$sessions_tbl."` (`email`, `time`, `sessionid`)
        VALUES ('".$email."', '".$time."', '".$session."');";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }   

    $conn->close();
    header( "Location: $url" );
}
?>
