<?php 

	include 'sql-function.php';
	
	$conn = ConnectDatabse();

	if( $_REQUEST["type"] ) {

		if($_REQUEST["type"]=="update") {

			$name = $_REQUEST["name"];
			$str = $_REQUEST["update"];
			UpdateObject($conn, $name, $str);
		}
		
	}
	
	CloseDatabase($conn);
?>