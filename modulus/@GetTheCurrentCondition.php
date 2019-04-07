<?php

/**
 * @GetTheCurrentCondition.php
 *
 * This file will create condition file for the experiment. 
 * Condition file is saved in 'conditions/[subject]/block[i].json'
 * @author Wenyan Bi <wb1918a@american.edu>
 * @copyright 2019.03 Wenyan
 */



// ---------------------------------------------------------//
// ------------- Process the data  ----------------------//
// ---------------------------------------------------------//
//echo "For Test";
$myData = json_decode($_POST['myData']);
$currentConditionFolder =  $myData->currentConditionFolder;
$blockNumber = $myData->blockNumber;


$fileName = $currentConditionFolder . 'block' . $blockNumber . '.json';

if (file_exists($fileName)){
    $fileContent = file_get_contents($fileName);
}

echo $fileContent;

?>