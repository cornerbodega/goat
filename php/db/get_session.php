<?php
ob_start();
include "database.php";

$email = $_COOKIE["email"];
//echo $email;
$conn = new mysqli($host, $dbun, $dbpw, $sessions_db);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT sessionid,license from ".$sessions_tbl." where
    email = '".$email."' order by time desc limit 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $sessionid = $row["sessionid"];
        $license = $row["license"];
    }
} else {
    echo "0 results for " . $email ;
}
$conn->close();
$json = ["email"=>$email, 
    	"sessionid"=>$sessionid,
    	"license"=>$license];
$getResult = json_encode($json);
echo $getResult;
#GET SESSION FROM DB HERE

?>
