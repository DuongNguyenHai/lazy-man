<?php 

define("serverName", "localhost");
define("userName", "root");
define("password", "nightsky");
define("dbname", "home");
define("TABLE", " device "); // need space between 'device'

// Create connection
function ConnectDatabse() {
	$conn = mysqli_connect(serverName, userName, password, dbname);
	// Check connection
	if (!$conn)
	    die("Connection failed: " . mysqli_connect_error());
	else;
		// echo "Connection database success !\n";
	return $conn;
}

// Disconnect to database
function CloseDatabase($conn) {
	mysqli_close($conn);
}

// Create a new table
// This fuction just suitable for light object
// ex : InsertObject($conn,"obj-slider", "objName-light", NULL,"Living Room Light", 0, 30, "fa-lightbulb-o");

function InsertObject($conn, $objType, $objName, $state, $objFalvor, $timer, $consumption, $amplitude, $icon="fa-wrench") {
	
	$sql = "INSERT INTO " . TABLE . " (type, name, state, flavor, timer, consumption, amplitude, icon)
	VALUES ('$objType', '$objName', '$state', '$objFalvor', '$timer', '$consumption', '$amplitude', '$icon')";
	// echo $sql . PHP_EOL;
	if ($conn->query($sql) === TRUE)
	    echo "New record created successfully" . PHP_EOL;
	else
	    echo "Error: " . $sql . " : " . $conn->error . PHP_EOL;
}

// Delete object 
// ex : DeleteObject($conn, "objName-light");
function DeleteObject($conn, $objName) {

	$sql = "DELETE FROM " . TABLE . " WHERE name='$objName' ";
	// echo $sql . PHP_EOL;
	if ($conn->query($sql) === TRUE)
	    echo "Record deleted successfully" . PHP_EOL;
	else
	    echo "Error deleting record: " . $conn->error . PHP_EOL;
}

function UpdateObject($conn, $objName, $propChange) {

	$sql = "UPDATE " . TABLE . " SET $propChange WHERE name='$objName' ";
	echo $sql . PHP_EOL;
	if ($conn->query($sql) === TRUE)
	    echo "Record updated successfully" . PHP_EOL ;
	else
	    echo "Error updating record: " . $conn->error . PHP_EOL;
}

// Get object properies
function GetObject($conn) {

	$sql = "SELECT *  FROM device";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	        echo $row["type"]. " " . $row["name"]. " " . $row["state"] . " " . $row["flavor"] . " " . $row["consumption"] . " " . $row["amplitude"] . " " . $row["icon"] . PHP_EOL;
	    }
	} else {
	    echo "0 results";
	}
}

// Print Log
function PrintLog($log) {
}

?>