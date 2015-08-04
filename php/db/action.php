<?php
$params = json_decode(file_get_contents('php://input'),true);


$curl = curl_init();
$requestJSON = json_encode($params);
echo $reuqestJSON;
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://wslcb.mjtraceability.com/serverjson.asp",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $requestJSON,
  CURLOPT_HTTPHEADER => array(
    "content-type: application/json"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
$j = json_decode($requestJSON, true);
$j["time"] = time();
$requestJSON = json_encode($j);
$file = 'action.log';
#file_put_contents($file,serialize($params)."\n", FILE_APPEND);
file_put_contents($file,$requestJSON."\n", FILE_APPEND);
#$file_put_contents($file,[$id, $reason, $action, $session, $quantity], FILE_APPEND);
