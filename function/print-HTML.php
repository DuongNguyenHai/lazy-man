<?php 

function PrintObjectDatabase($conn) {

	$sql = "SELECT *  FROM device";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	        PrintObject($row["type"], $row["name"], $row["state"], $row["flavor"], $row["timer"], $row["consumption"], $row["amplitude"], $row["icon"]);
	    }
	} else {
	    echo "0 results";
	}
}

// Print object
function PrintObject($objType, $objName, $state, $objFalvor, $timer, $consumption, $amplitude, $icon) {

	if($state) {
		$stateButton = "switch-on";
		$stateName = "turn-on";
	}
	if(  $timer && $state ) {
		$stateTimer = "timer-on";
		$timerVal = $timer;
	}

	echo '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">';
		echo '<div class="object '.$objType . " " .$objFalvor. " " .$stateName.'">';
			echo '<div class="obj-info">',
	                '<p class="obj-header">'.$objName.'</p>',
	                '<p class="obj-power-consumption">
	                	<i class="fa fa-plug"></i>
	                	<span class="power-conspt-value">' . $consumption .'</span> Kwh
	                </p>';

	            if( $objType != "obj-button")
	            echo'<p class="obj-counter-percent">',
	                	'<i class="fa '.$icon.'"></i>',
	                	'<b class="counter">'.$amplitude.'</b>',
	                '</p>';
	        echo  '</div>';
	    	echo '<div class="obj-timer">
	                <svg class="timer-progress" viewbox="0 0 82 82">
	                  <circle class="progress-bg" r="39" cx="41" cy="41" stroke-dasharray="245"></circle>
	                  <circle class="progress-bar" r="39" cx="41" cy="41" stroke-dasharray="245"></circle>
	                </svg>',
	                '<i class="obj-icon fa '.$icon.'"></i>',
	                '<div class="obj-timer-set '.$stateTimer.'">
	                  <span class="obj-timer-edit">
	                    <i class="fa fa-clock-o" aria-hidden="true"></i>
	                  </span>
	                  <input class="obj-timer-val" placeholder="NULL" type="text" value="'.$timerVal.'">
	                  <span class="obj-timer-on">
	                    <i class="fa fa-check" aria-hidden="true"></i>
	                  </span>
	                </div>
	              </div>';
	        if( $objType == "obj-slider")
	    		echo '<div class="slider-range-min"></div>
	    				<div class="obj-off"><i class="fa fa-close"></i></div>';
	        else if( $objType == "obj-button")
	        	echo '<div class="switch-button '.$stateButton.'"></div>';
	        else if( $objType == "obj-turn obj-slider" ) {
	        	echo '<div class="switch-button type-turn"></div>
	        			<div class="obj-off"><i class="fa fa-close"></i></div>
	        			<div class="slider-range-min"></div>';
	        }
	        echo ' <div class="clearfix"></div>';
		echo '</div>';
	echo '</div>';
	
}

// Print object : send special name and value
function PrintObjectSend() {

	echo '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-6">
            <div class="object obj-button obj-send send">
              <div class="obj-info">
                <p class="obj-header">Send To</p>
                <div class="send-name type-input">
                  <label for="name">Name : </label>
                  <input type="text" name="name" class="input-name">
                </div>
                <div class="send-state type-input">
                  <label for="state">State : </label>
                  <input type="text" name="state" class="input-sate">
                </div>
              </div>
              <button class="submit submit-button" type="button"><i class="obj-icon fa fa-send"></i><span>Send</span></button>
              <div class="obj-off"><i class="fa fa-close"></i></div>
              <div class="clearfix"></div>
            </div>
          </div>';
}
	
?>