<?php

/**
 * Database_config.php
 *
 * This is the configuration file for the sql database
 * Tested on MySQL version: 5.6.37
 *
 * @author Wenyan Bi <wb1918a@american.edu>
 * @2019.03.28
 */



// ---------------------------------------------------------//
// ---------- Set SQL configuration ---------------//
// ---------------------------------------------------------//

$servername = "localhost";
//$port=3306;
$username = "root";
$password = "mysql";
$dbname = "myResults";
$table = "Trans_matching_data";  // [wb]: The table for transluscency experiment

// ---------------------------------------------------------//
// -------------- Connect to MySQL   -----------------------//
// ---------------------------------------------------------//

$conn = new mysqli($servername, $username, $password);
if ($conn -> connect_error) {
	die ("Fail connecting to SQL: " . $conn->connect_error);
}

// ---------------------------------------------------------//
// ----------Make $dbname the current database -------------//
// ---------------------------------------------------------//

// [wb]: Make $dbname the current database
if ($conn -> select_db($dbname) == TRUE) {
    //echo "Successfully connected to database:" . $dbname;
} else{
    // [wb]: If can't connect to the database, it might because it doesn't exist;
    $sql = "CREATE DATABASE IF NOT EXISTS " . ($dbname);
    if ($conn -> query($sql) == FALSE) {
        die ("Error creating database (" . $dbname . "):" . $conn -> error . "...");
    }
//    else {
//        echo "Successfully creating database:" . $dbname;
//    }
    }


// ---------------------------------------------------------//
// ---------- Creat $table if it doesn't exist -------------//
// ---------------------------------------------------------//

// [wb]: Check whether $table exists;
$table_exist = $conn->query("SHOW TABLES LIKE '{$table}'");
// Check whether $table exists; Create it if it doesn't;
if ($table_exist -> num_rows == 1){
    ; // [wb]: If $table exists
} else {
    // [wb]: If $table doesn't exist, create it;
    // ID: 
    // sub: subject name;
    // blockN: current block number (from 1-4);
    $sql = "CREATE TABLE . $table (
    id INT(1) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    sub VARCHAR(50) NOT NULL,
    blockN INT(1) NOT NULL,
    conditionOrder VARCHAR(2000) NOT NULL,
    trialNumber VARCHAR(2000) NOT NULL,
    response VARCHAR(2000) NOT NULL,  
    targetDensities VARCHAR(2000) NOT NULL,
    targetBlurs VARCHAR(2000) NOT NULL,
    targetHeight VARCHAR(2000) NOT NULL,
    targetIlluminations VARCHAR(2000) NOT NULL,
    matchedDensities VARCHAR(2000) NOT NULL,
    reg_date DATETIME)";
    
    if (mysqli_query ($conn, $sql)) {
        ;
        echo "Successfully creating table: Trans_matching_data" ;
        echo "<br />";
    } else {
        die (" Fail to create the table([" . $table . "]): " . mysqli_error($conn));
    }
}
// ---------------------------------------------------------//
// ------------------- Drop $table  ------------------------//
// ---------------------------------------------------------//
// [wb]: Drop the sql table : 
// $sql = "DROP TABLE Trans_matching_data";
// mysqli_select_db( $conn, 'Trans_matching_data');
// $retval = mysqli_query( $conn, $sql );
// if(! $retval )
// {
//   die('Fail to delete: ' . mysqli_error($conn));
// }
// echo "Success deleting!";
// echo "<br />";



?>