<?php

/**
 * @WriteDataSQL.php
 *
 * This file will write data to the SQL database. 
 * Will call "@Database_config.php"

 * @author Wenyan Bi <wb1918a@american.edu>
 * @2019.03.28
 */



// ---------------------------------------------------------//
// ---------------------------------------------------------//
// mydata = {
// 	subject:subject,
// 	blockNumber:blockNumber,
// 	conditionOrder: currentConditionIndex,
// 	trialNumber:[],
// 	response:[],   // matched index
// 	targetDensities:[],
// 	targetBlurs:[],
// 	targetHeight:[],
// 	targetIlluminations:[],
// 	matchedDensities:[]
//     };


// ---------------------------------------------------------//
// ------------- Process the data  ----------------------//
// ---------------------------------------------------------//
$myData = json_decode($_POST['mydata']);

for ($i=0; $i<count($myData->trialNumber); ++$i) {
    $myData->conditionOrder[$i];
    $myData->trialNumber[$i];
    $myData->response[$i];
    $myData->targetDensities[$i];
    $myData->targetBlurs[$i];
    $myData->targetHeight[$i];
    $myData->targetIlluminations[$i];
    $myData->matchedDensities[$i];
}

$myData->conditionOrder = json_encode($myData->conditionOrder);
$myData->trialNumber = json_encode($myData->trialNumber);
$myData->response = json_encode($myData->response);
$myData->targetDensities = json_encode($myData->targetDensities);
$myData->targetBlurs = json_encode($myData->targetBlurs);
$myData->targetHeight = json_encode($myData->targetHeight);
$myData->targetIlluminations = json_encode($myData->targetIlluminations);
$myData->matchedDensities = json_encode($myData->matchedDensities);

// ---------------------------------------------------------//
// ------------- Save data to $table  ----------------------//
// ---------------------------------------------------------//

// [wb]: Include database_configuration file
 include('@Database_config.php');

$cur_date = date('Y-m-d H:i:s');
$sql = "INSERT INTO .$table (sub, blockN, conditionOrder, trialNumber, response, targetDensities, targetBlurs, targetHeight, targetIlluminations, matchedDensities, reg_date)
    VALUES ('$myData->subject', 
    '$myData->blockNumber', 
    '$myData->conditionOrder',
    '$myData->trialNumber',
    '$myData->response',
    '$myData->targetDensities',
    '$myData->targetBlurs',
    '$myData->targetHeight',
    '$myData->targetIlluminations',
    '$myData->matchedDensities',
    '$cur_date')";
if (mysqli_query($conn, $sql)) {
    echo "Data saved successfully!";
} else {
    echo "Failed to save data:" . mysqli_error($conn);
}
echo "<br>";

mysqli_close($conn); 

// [wb]: Drop the preexisting table:
// In terminal: DROP TABLE Trans_matching_data;


?>