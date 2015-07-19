<?php


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
$session = $j['sessionid'];
$response = json_encode($j);
curl_close($curl);
if ($err) {
  echo "cURL Error #:" . $err . "\nsupport@marvin.technology";
} else {
  //echo $response;
}
$_SESSION ["session"] = $session;
#$_SESSION ["email"] = $email;
$url = "inventory.html";
header( "Location: $url" );

