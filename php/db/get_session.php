<?php
ob_start();
include "database.php";

$email = $_COOKIE["email"];
$conn = new mysqli($host, $dbun, $dbpw, $sessions_db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT sessionid from ".$sessions_tbl." where
    email = '".$email."' order by time desc limit 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $sessionid = $row["sessionid"];
    }
} else {
    echo "0 results";
}
$conn->close();
$json = ["email"=>$email, 
    "sessionid"=>$sessionid];
$getResult = json_encode($json);
echo $getResult;
#GET SESSION FROM DB HERE

?>
