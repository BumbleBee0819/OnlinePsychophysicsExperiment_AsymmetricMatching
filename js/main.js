/**
 * <main.js>
 *
 * For Asymmetric Matching Experiment:
 *
 * 1) Users type in their name. 
 *      If the subject folder is not already under [conditions], create the folder and generate the condition files for the current user.
 *      Read in the current condition file (e.g., block1.json).
 * 2) Instruction page with two demo images will show up; Click "Start" to start the experiment.
 * 3) During the experiment, can click "Show Instruction" to read the instruction again.
 * 4) Two images (target & match) are set side by side.
 *      Users move the slider bar (or press left/right arrow key) to adjust the 'density' of the [match] image.
 *      Click "Next" to move on.
 * 5) When the experiment ends, data can be either saved as seperate "json" files; or stores in a MySQL database.
 * 
 * 
 * Wenyan Bi <wb1918a@american.edu>
 * Bei Xiao <bxiao@american.edu>
 *
 * @2019.04.07
 */


    
//!--================================================================================--//   
//$(document).ready(function() {
//  // [wb]: Executes when HTML-Document is loaded and DOM is ready; take shorter time


$(window).load(function() {
    // [wb]: Executes when complete page is fully loaded, including all frames, objects and images; take longer time
	'use strict';
    
    var subject = 'test'; // [wb]: Default subject name; will be updated by user input.
    var blockNumber = 1; // [wb]: Default block number; will be updated by parsing url.

    
    //!--------- Candidate pool for [density, blur, illumination, height] ----------//
    
    // [wb]: All possible height values (Same for target/match images)
    var heights = ["0.01", "0.02", "0.03", "0.04", "0.05"],
        numHeights = heights.length;   
    
    // [wb]: All possible illumination values (Same for target/match images)
    var illuminations = ["sidelit","backlit"],
        numIlluminations = illuminations.length;

    // [wb]: All possible density values for target images
    var targetDensities = ["111","150","184","225"],
        numTargetDensities = targetDensities.length;
    
    // [wb]: All possible density values for match images
    var matchDensities =["74","82","90","100","111","122","136","150","166","184","203","225","249","276","295"],
        numMatchDensities = matchDensities.length;
    
    // [wb]: All possible blur values for target images
    var targetBlurs = ["0.4","1.0","2.0","2.8"],  
        numTargetBlurs = targetBlurs.length;
    
    // [wb]: All possible blur values for match images
    var matchBlurs = ["1.2"],   
        numMatchBlurs = matchBlurs.length;

    
    // [wb]: Total trial number for each subject.
    var nTrials = numTargetDensities * numTargetBlurs * numIlluminations * numHeights;  
    // [wb]: How many blocks; used to generate the condition file for new subject.
    var nBlocks = 4; 
    

    //!--------- Path ----------//
    
    // [wb]: Folder of the images
    var targetRoot = 'stimuli/soap_map_';
    var matchRoot = 'stimuli/soap_map_';
    // [wb]: Folder of the condition files
    var conditionFolderRoot = 'conditions'; 
    // [wb]: e.g., 'conditions/wb/'
    var currentConditionFolder = '';
    var dataSaveFile = 'modulus/@WriteDataJSON.php';   //[wb]: Saved as .json files;
//    var dataSaveFile = 'modulus/@WriteDataSQL.php';       //[wb]: Saved into SQL database;


    
    //!--------- The current trial ----------//
    
    //[wb]: Sequentially stored blur values for the current experiment (len = nTrials).
    var t_blurs = []; 
    //[wb]: Sequentially stored density values for the current experiment (len = nTrials).
    var t_densities = [];          
    var t_heights = [];
    var t_illuminations = [];  
    //[wb]: The condition index (randomized) for the current experiment/block. Used like: t_blurs[currentConditionIndex]
    var currentConditionIndex = []; 
    var totalConditions = currentConditionIndex.length;  // [wb]: equals to the number of trials of the current block.
    
    var currentTargetFrames = [];  // [wb]: Store the target image path of the current trial (size of 1)
    var currentMatchFrames = [];  // [wb]: Stores the match images path of the current trial   

    var curTrial = -1; // [wb]: The current trial number. 
    var currentTargetImageIndex = -1, // [wb]: The index of the current trial (randomized)
        currentTargetDensity = -1,
        currentTargetBlur = -1,
        currentTargetHeight = -1,
        currentTargetIllumination = -1, 
        currentMatchDensity = [],
        currentMatchBlur = [],
        currentMatchHeight = 0,   // [wb]: The heights are the same for the target and the match images.
        currentMatchIllumination = 'illumination'; // [wb]: The illuminations are the same for the target and the match images. 
 
    var tmpMatchingDensity = -1;  // [wb]: The current mathcing density of the slider bar
    //var finalMatchedBlurIndex = 0; 
    // [wb]: Stores the current match images.
    var currentImages = new Array(numMatchDensities);
    
    
    
    //!--------- Miscellaneous ----------//
    var i=0, j=0, k=0, n=0, maxi = 0,
        tmpSubject = 'test',
        tmpBlockNumber = 0,  // [wb]: the current block number extracted from url
        tmpData = {};  // [wb]: tmp Data prepared for ajax.
    
    var ready = false;  //[wb]: Is true if all the images have been fully preloaded.
    var editing = false;
    var loaded = 0; //[wb]: Whether the images have been preloaded
    var sliderBarInitialPosition = 0;    // [wb]: The initial position of the slider bar.

    
    //!--===================== Define functions ============================--//
    
    // [wb]: Get the block number from URL.
    function getQueryVariable(variable) {
        var i, 
            query, 
            vars, 
            pair;
        // [wb]: Get the conents after ? from the current url;
        // e.g., https://www.w3schools.com/html/tryit.asp?filename=tryhtml_default
        query = window.location.search.substring(1);
        vars = query.split("&");
        for (i = 0; i < vars.length; i ++) {
            pair = vars[i].split("=");
            if(pair[0] == variable) return pair[1];
        }
        return false;
    }
    
    // [wb]: Load the images
    function loadImages(src) {
        this.image = new Image();
        this.src = src;
    }

    
    
    //!--===================== Prepare data for the current experiment  ============================--//     
    // [wb]: Get information for the current subject.
    tmpSubject = prompt("Please enter your initials");
    subject = tmpSubject ? tmpSubject : subject;   // [wb]: Get the current subject name.
    currentConditionFolder = '../' + conditionFolderRoot + '/' + subject + '/';  // [wb]: Condition file folder for current subject.
    tmpBlockNumber = getQueryVariable("blockNumber");
    blockNumber = tmpBlockNumber ? tmpBlockNumber : blockNumber;    // [wb]: Get th current block number.             

        
    
    // [wb]: Generate the condition file for the current subject (if it not exists).  
    tmpData = {currentConditionFolder: currentConditionFolder,
               blockNumber: blockNumber, 
               nBlocks: nBlocks,
               nTrials: nTrials
              };
    
    $.ajax({
        url: 'modulus/@CreateBlocks.php',
        type: 'POST',
        dataType: 'text',
        async: false,    // [wb]: Get a warning
        data: {myData:JSON.stringify(tmpData)},
        success: function (response){
            // [wb]: Only show the response when it is not empty.
            if (response){
                alert(response);  
            }
        }
    });
    
    
    
    
    // [wb]: Get the current condition index file.    
    tmpData = {currentConditionFolder: currentConditionFolder,
               blockNumber: blockNumber
              };
    
    // [wb]: currentConditionIndex has to be empty
    if (totalConditions != 0) {
        var e = new Error('[currentConditionIndex] is not empty'); 
        throw e;
        }
    
    $.ajax({
        url: 'modulus/@GetTheCurrentCondition.php',
        type: 'POST',
        dataType: 'json',
        async: false,    // [wb]: Will get a warning
        data: {myData:JSON.stringify(tmpData)},
        success: function (response){
            for (var i = 0, len=response.length; i<len; i++) {
                currentConditionIndex.push(response[i]);
            }
        },
        failure: function () {
            alert("Failed to load condition file!!!");
        }
        
    });
    // [wb]: Update the total condition number
    totalConditions = currentConditionIndex.length;
//    alert(totalConditions);
    
    
    // [wb]: The arrays (e.g., t_blurs) that contain all [nTrials] values.
    for (k = 0; k < numIlluminations; k++) {
        for (n = 0; n < numHeights; n++){
            for(i = 0; i < numTargetDensities; i++){
                for(j = 0; j < numTargetBlurs; j++){
                    t_blurs.push(targetBlurs[j]);
                    t_densities.push(targetDensities[i]);
                    t_heights.push(heights[n]);
                    t_illuminations.push(illuminations[k]);
                }
            }
        }
    }
    
    
        // [wb]: Final results (to be saved).
    var data = {
        subject:subject,
        blockNumber:blockNumber,
        //finalMatchedBlurIndex: -1,    // [wb]: final matched value
        conditionOrder: currentConditionIndex,
        trialNumber:[],
//        indexNumber:[], // [wb]: For debug
        response:[],   // matched index
        targetDensities:[],
        targetBlurs:[],
        targetHeight:[],
        targetIlluminations:[],
        matchedDensities:[]
    };
    
    

    
    //!--===================== Experimental Procedure  ============================--//    
    
    // [wb]: this is for the user to go to the Next trial, where it updates both match and target.
    $("#next").click(function(){
        ready = false;
        curTrial = curTrial + 1;   // Update the trial number
        var button = $(this);
        
        // [wb]: Click "Start" to start the experiment.
        if (button.text() == 'Start') {
            // If just started (i.e., clicked the "start" button:
            button.text('Next');
            $("#instruction").css("display", "none");  // [wb]: Hide inline instruction
//            $(".vid-border").css("display", "none");
        }
            
        // [wb]: Save the response of the previous trial
        if (curTrial > 0) {
            data.trialNumber.push((curTrial-1)+1); // [wb]: Starting from 1.
            //data.indexNumber.push(currentConditionIndex[[curTrial-1]]); //[wb]: For debug.
            data.targetDensities.push(t_densities[currentConditionIndex[curTrial-1]]) // i.e., currentTargetDensity;
            data.targetIlluminations.push(t_illuminations[currentConditionIndex[curTrial-1]]); // i.e., currentTargetIllumination
            data.targetBlurs.push(t_blurs[currentConditionIndex[curTrial-1]]); //i.e., currentTargetBlur
            data.targetHeight.push(t_heights[currentConditionIndex[curTrial-1]]); // i.e., currentTargetHeight
            data.response.push(tmpMatchingDensity);
            data.matchedDensities.push(currentMatchDensity[tmpMatchingDensity]); //[wb]: Need modity: if the target/match images differ more than just density;
        }
 
        
        // [wb]: If doesn't reach the maximum trial number: Update the target/match images
        if (curTrial >= totalConditions){
            // [wb]: Send out the data;
            $.ajax({
                // [wb]: Save as JSON files
                url: dataSaveFile,
//                // [wb]: Save as SQL database
//                url: 'modulus/@WriteDataSQL.php', 
                type: 'POST',
                dataType: 'text',
                async: false,
                data: {mydata:JSON.stringify(data)},
                success: function (response){
                    if (response){
                        alert(response);
                    }
                },
                failure: function () {
                    alert("Failed to save data!!!");
                }
            });

            
            
            // [wb]: Hide everything & Show the thank you page
            $("#showInstruction").css("display", "none");
            $("#img_table").css ("display", "none");
            $("#density").css("display", "none");
            $("#finalResult").css("display", "none");
            $("#nextTrial").css("display", "none");
            $("#thankYou").css("display", "block");

//            console.log(data.response);
        } else {
            //console.log(curTrial);
            //!--=======  Prepare the stimuli =======--//   
            currentTargetImageIndex = currentConditionIndex[curTrial];  // [wb]: Get the index for the current trial (i.e., trial=0)
            
            currentTargetDensity = t_densities[currentTargetImageIndex];  // [wb]: Density  value of the tartget image of the current trial
            currentTargetBlur = t_blurs[currentTargetImageIndex];  
            currentTargetHeight = t_heights[currentTargetImageIndex];
            currentTargetIllumination = t_illuminations[currentTargetImageIndex];
            
            currentMatchDensity = matchDensities;  // [wb]: Array, the same for all trials;
            currentMatchBlur = matchBlurs;  // [wb]: Array, size of 1, the same for all trials.
            currentMatchHeight = currentTargetHeight; // [wb]: Same as the target
            currentMatchIllumination = currentTargetIllumination;  // [wb]: Same as the target
            
            //!--===========  Update the DOM ===========--//
            // [wb]: Initialize the slider bar based on [currentMatchDensity, currentMatchBlur]
            maxi = (currentMatchDensity.length * currentMatchBlur.length) - 1;
            sliderBarInitialPosition = Math.floor(maxi/2); //[wb]: The slider is initially set in the middle   
            $("#densityVal").slider();
            $("#densityVal").slider("option", "min", 0);
            $("#densityVal").slider("option", "max", maxi);   // [wb]: This number is determined by currentMatchFrames.length
            $("#densityVal").slider("option", "value", sliderBarInitialPosition);
            
            // [wb]: Hide everything except the loading icon
            $("#showInstruction").css("display", "none");
            $("#img_table").css ("display", "none");
            $("#density").css("display", "none");
            $("#nextTrial").css("display", "none");
            $("#finalResult").css("display", "none");
            $("#loading_icon").css("display", "block");   

            
            
            //!--===========  Preload the stimuli ===========--//     
            // [wb]: Target image for the current trial [only one].
            currentTargetFrames = [];
            currentTargetFrames.push(targetRoot + 'b' + currentTargetBlur + '_museum'+ '_s' + currentTargetHeight + '_' +
                            currentTargetIllumination + '_d' + currentTargetDensity + '_q4096.jpg?p=' + Date.now());
            
            // [wb]: Match image candidates for the current trial.
            currentMatchFrames = []; // [wb]: Its length = len(density_levels) * len(blur_levels)
            for (i = 0; i < currentMatchDensity.length; ++i ) {
                for (j = 0; j < currentMatchBlur.length; ++j) {
                    currentMatchFrames.push(targetRoot + 'b' + currentMatchBlur[j] + '_museum'+ '_s' + currentMatchHeight + '_' + currentMatchIllumination + '_d' + currentMatchDensity[i] + '_q4096.jpg?p=' + Date.now());
                }
            }  
            
            
            // [wb]: Load the images.
            currentImages = new Array(currentMatchFrames.length);
            tmpMatchingDensity = sliderBarInitialPosition;

            
            for (i = 0; i < currentMatchDensity.length; i++) {
                currentImages[i] = new loadImages(currentMatchFrames[i]);
            }
            
            ready = true;
            tmpMatchingDensity = sliderBarInitialPosition;
            
            $('#finalresult').text(tmpMatchingDensity);
            $("#densityVal").slider("option", "value", sliderBarInitialPosition);
            $("img#target").attr("src", currentTargetFrames[0]);
            $("img#match").attr("src", currentImages[tmpMatchingDensity].src);
            // [wb]: Hide the loading icon and show everything else
            $("#showInstruction").css("display", "inline-block");
            $("#img_table").css ("display", "block");
            $("#density").css("display", "inline-block");
            $("#densityVal").slider("option", "value", tmpMatchingDensity); //Reset the slider
            $("#nextTrial").css("display", "block");
            $("#curTrial").text(curTrial+1); // update [curTrial/40]
            $("#totalTrial").text(totalConditions);
            $("#finalResult").css("display", "none");
            $("#loading_icon").css("display", "none");
        }
    })
        
        

        
        

    

    
    //!--===================== Event: When sliding the slider bar  ============================--// 
    // [wb]: Show the corresponding image of the sliding bar
    $("#densityVal").on("slide", function(event, ui) {
        // Bind an event listener to the slidestop event.
        if (ready) {
            var resp = ui.value;
            tmpMatchingDensity = resp;
            $('img#match').attr('src', currentImages[tmpMatchingDensity].src);
            $('#finalresult').text(tmpMatchingDensity);
            //$('img#match').attr('src', currentImages[tmpMatchingDensity+1].src);
        }
    });
    
    //!--===================== Event: When pressing keys   ============================--// 
    // [wb]: User navigates using keyboard
    $(document).keydown(function(e) {
        if (ready) {
            var changed = false;
            
            switch ( e.which ) {
                case 39: // [wb]: Right Arrow
                    if (tmpMatchingDensity + 1 < currentMatchDensity.length) {
                        ++tmpMatchingDensity;
                        $("#densityVal").slider("value", tmpMatchingDensity);
                        changed = true;
                    }
                    break;
                
                case 37: // [wb]: Left Arrow
                    if (tmpMatchingDensity > 0) {
                        --tmpMatchingDensity;
                        $("#densityVal").slider("value", tmpMatchingDensity);
                        changed = true;
                    }
                    break;
            }
            
            if (changed) {
                $('img#match').attr('src', currentImages[tmpMatchingDensity].src);
//                $('#finalresult').text(tmpMatchingDensity); //[wb]: For debugging.
            }
        }
});


    //!--===================== Event: Control the pop-up box  ============================--// 
    // [wb]: Open the pop-up box
    $("#showInstruction").click(function(){
        $(".popup-overlay, .popup-content").addClass("active");
    })
    
    // [wb]: Close the pop-up box
    $("#close").click(function(){
        $(".popup-overlay, .popup-content").removeClass("active");
    })
    
    
});
                     

