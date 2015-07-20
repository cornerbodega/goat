<?php
$params = json_decode(file_get_contents('php://input'),true);


$curl = curl_init();
$id = $params['id'];
$reason = $params['reason'];
$action = $params['action'];
$session = $params['session'];
$quantity = $params['quantity'];
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://wslcb.mjtraceability.com/serverjson.asp",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\"API\": \"4.0\",\n\"action\": \"".$action."\",\n\"sessionid\":\"".$session."\",\n\"data\":{\"barcodeid\": ". $id .",\n\"reason\": \"". $reason ."\",\n\"type\": \"1\",\n\"quantity\": \"".$quantity."\"\n}\n}",
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

$file = 'adjust.log';
file_put_contents($file,serialize($params)."\n", FILE_APPEND);
#$file_put_contents($file,[$id, $reason, $action, $session, $quantity], FILE_APPEND);
