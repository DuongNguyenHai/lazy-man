<?php

define("serverName", "localhost");
define("userName", "root");
define("password", "nightsky");
define("dbName", "home");
define("TABLE", " device "); // need space between 'device'

// Create connection
$conn = mysqli_connect(serverName, userName, password);
if (!$conn)
    die("Connection failed: " . mysqli_connect_error()) . PHP_EOL;
else
	echo "Connection database success !" . PHP_EOL;

// Create a new database
$sql = 'CREATE DATABASE IF NOT EXISTS ' . dbName .'';
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully" . PHP_EOL;
} else {
    echo "Error creating database: " . mysqli_error($conn) . PHP_EOL;
}

// Select database
$sql = 'USE ' . dbName . '';
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully" . PHP_EOL;
} else {
    echo "Error creating database: " . mysqli_error($conn) . PHP_EOL;
}
// sql to create table
CreateTable($conn, "device");

// Insert object to database

InsertObject($conn,"obj-slider", "Living Room Light", 0, NULL, NULL, 0, 30, "fa-lightbulb-o");
InsertObject($conn,"obj-button", "Toilet Light", 0, "flavor-green", "0h", 0, 30, "fa-lightbulb-o");
InsertObject($conn,"obj-slider", "Bed Room Light", 0, "flavor-orange", "10h20", 0, 30, "fa-lightbulb-o");
InsertObject($conn,"obj-button", "Font Door", 0, "flavor-violet", NULL, 0, 0);

// Delete object to database

// DeleteObject($conn, "DC Motor");

// Update object

// UpdateObject($conn,"Bed Room Light","flavor='flavor-green'");

// Get object properties

// GetObject($conn);

mysqli_close($conn);

// function create a table if not exist

function CreateTable($conn, $table) {

	$tableName = $table;

	$sql = "CREATE TABLE IF NOT EXISTS $tableName (
		id INT(32) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		type VARCHAR(30) NOT NULL DEFAULT 'obj-slider',
		name VARCHAR(50) NOT NULL,
		state BOOLEAN NOT NULL DEFAULT 0,
		flavor VARCHAR(20) DEFAULT NULL,
		timer VARCHAR(20) DEFAULT '0h',
		consumption INT(6) DEFAULT 0,
		amplitude INT(6) DEFAULT 0,
		icon VARCHAR(15) DEFAULT 'fa-wrench'
	)";
	if (mysqli_query($conn, $sql)) {
	    echo "Table device created successfully\n";
	} else {
	    echo "Error creating table: " . mysqli_error($conn);
	}
}

// function insert object to table
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
// function update to object
function UpdateObject($conn, $objName, $propChange) {

	$sql = "UPDATE " . TABLE . " SET $propChange WHERE name='$objName' ";
	echo $sql . PHP_EOL;
	if ($conn->query($sql) === TRUE)
	    echo "Record updated successfully" . PHP_EOL ;
	else
	    echo "Error updating record: " . $conn->error . PHP_EOL;
}


?>