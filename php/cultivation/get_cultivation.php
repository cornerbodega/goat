<?php
$params = json_decode(file_get_contents('php://input'),true);

$curl = curl_init();
$session = $params['session'];
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://wslcb.mjtraceability.com/serverjson.asp",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\"API\": \"4.0\",\n\"action\": \"sync_plant\",\n\"sessionid\":\"".$session."\",\n}",
  CURLOPT_HTTPHEADER => array(
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}

