<?php

include 'sql-function.php';
$servername = "localhost";
$username = "root";
$password = "nightsky";
$dbname = "home";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
	// Check connection
	if (!$conn)
	    die("Connection failed: " . mysqli_connect_error());
	else
		echo "Connection database success !\n";

// sql to create table

// CreateTable("device");

// Insert object to database

// InsertObject($conn,"obj-slider", "Living Room Light", 0, NULL, NULL, 0, 30, "fa-lightbulb-o");
// InsertObject($conn,"obj-button", "Toilet Light", 0, "flavor-green", "0h", 0, 30, "fa-lightbulb-o");
// InsertObject($conn,"obj-slider", "Bed Room Light", 0, "flavor-orange", "10h20", 0, 30, "fa-lightbulb-o");
InsertObject($conn,"obj-button", "Font Door", 0, "flavor-violet", NULL, 0, 0);

// Delete object to database
// DeleteObject($conn, "DC Motor");

// Update object
// UpdateObject($conn,"Bed Room Light","flavor='flavor-green'");

// Get object properties
// GetObject($conn);

function CreateTable($table) {

	$tableName = $table;

	$sql = "CREATE TABLE $tableName (
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

mysqli_close($conn);

?>