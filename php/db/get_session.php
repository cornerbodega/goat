<?php
include "database.php";

$conn = new mysqli($host, $username, $password, $sessions_db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";

$sql = "INSERT INTO ".$sessions_tbl." (email, time, sessionid)
    VALUES ('".$email."', '".$date."', '".$session."')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}   

$conn->close();
#GET SESSION FROM DB HERE

?>
