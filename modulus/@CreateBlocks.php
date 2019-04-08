<?php

/**
 * @Main_WriteData.php
 *
 * This file will create condition file for the experiment. 
 * Condition file is saved in 'conditions/[subject]/block[i].json'
 * @author Wenyan Bi <wb1918a@american.edu>
 * @2019.03.28
 */



// ---------------------------------------------------------//
// ------------- Process the data  ----------------------//
// ---------------------------------------------------------//
//echo "For Test";
$myData = json_decode($_POST['myData']);
$currentConditionFolder =  $myData->currentConditionFolder;
$blockNumber = $myData->blockNumber;
$nBlocks = $myData->nBlocks;
$nTrials = $myData->nTrials;

$mini = 0;
$maxi = $nTrials - 1;
$trialInEachBlock = floor($nTrials/$nBlocks);
$trialInLastBlock = $nTrials-$trialInEachBlock*($nBlocks-1);


if ($blockNumber > $nBlocks) {
    // [wb]: Abort if the total trial number is smaller than the block number;
    die ('Block number incorect! <br>');
} else {
    // [wb]:
    // Check whether the subject folder (i.e., conditions/[subject])exists;
    // If the folder doesn't exist, create the folder and generate the .json condition files; If the subject folder already exists, skip.
    if (!is_dir($currentConditionFolder)){
        // [wb]: Abort if can't create the folder for the current subject (i.e., conditions/[subject])
        if (!mkdir($currentConditionFolder)) {
            die ('Failed to create the condition folder: ' . $currentConditionFolder . ' <br>');
        } else { 
            // [wb]: Now generate the condition file for the current subject
            $range = range($mini, $maxi);
            shuffle($range); 
            
//            foreach($range as $tmp) {
//                echo $tmp . ', ';
//            }
 
            // [wb]: Generate condition file for each block;
            for ($i = 0; $i < $nBlocks; $i++) {
                if ($i == $nBlocks-1) {
                    $tmpData = $range;     
                } else {
                    $tmpData = array_slice ($range, 0, $trialInEachBlock);
                    $range = array_slice ($range, $trialInEachBlock, count($range));
                }
                
                $jsonData = json_encode($tmpData, JSON_PRETTY_PRINT);
                $tmpFileName = $currentConditionFolder . 'block' . ($i+1) . '.json';
                
//                foreach($tmpData as $tmp) {
//                    echo $tmp . ', ';
//                }          
                
                if(file_put_contents($tmpFileName, $jsonData)) {
                    // echo 'file' . $tmpFileName . 'saved<br>';
                } else {
                    // [wb]: 
                    // Abort if can not write the condition file for the current subject.
                    // e.g., conditions/[subject]/block1.json
                    die ('Can not write the json condition file! <br>');
                }
            }
            //echo ('Successfully generated the json condition files! <br>');
        }
        }  
    }


?>