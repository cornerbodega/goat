<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://wslcb.mjtraceability.com/serverjson.asp",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\"API\": \"4.0\",\n\"action\": \"sync_inventory\",\n\"sessionid\":\"64c7ab8217c31a6dcead486eb80e8948908b1bd10bdde332f9d83ccb60b5f696bb785425b1f481e2a9a7727d788c8c028b7c55382d95370f3396dea419bfb3ce\",\n\"active\":\"1\"\n}",
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
