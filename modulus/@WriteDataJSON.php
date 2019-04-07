<?php

/**
 * @WriteDataJSON.php
 *
 * This file will save data to "results/[sub]" folder as .json files. 
 *
 * @author Wenyan Bi <wb1918a@american.edu>
 * @copyright 2019.03 Wenyan
 */

// ---------------------------------------------------------//
// ---------------------------------------------------------//
// mydata = {
// 	subject:subject,
// 	blockNumber:blockNumber,
//  ...
// };
// ---------------------------------------------------------//
// ------------- Process the data  ----------------------//
// ---------------------------------------------------------//
$myJsonData = $_POST['mydata'];
$myData = json_decode($myJsonData);
$cur_date = urlEncode(date("Y_m_d_H_i_s"));
$cur_sub = $myData->subject;
$save_path = '../results/' .$cur_sub .'/';
$fileName = $save_path .$cur_sub ."_block_" .$myData->blockNumber . "_" .$cur_date .'_result.json';

// [wb]: Check path
if (!is_dir($save_path)){
	if (!mkdir($save_path)) {
		die ('Failed to create the folder to save data: ' . $save_path . ' <br>');
	}
}

// [wb]: Write results
$fh = fopen($fileName, 'w') or die("Can't open file to write the data");
fwrite($fh, json_encode($myData));
fclose($fh);

?>