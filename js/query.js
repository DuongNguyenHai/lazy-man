// Create a new event : doubletap

(function($){

  $.event.special.doubletap = {
    bindType: 'touchend',
    delegateType: 'touchend',

    handle: function(event) {
      var handleObj   = event.handleObj,
          targetData  = jQuery.data(event.target),
          now         = new Date().getTime(),
          delta       = targetData.lastTouch ? now - targetData.lastTouch : 0,
          delay       = delay == null ? 300 : delay;

      if (delta < delay && delta > 30) {
        targetData.lastTouch = null;
        event.type = handleObj.origType;
        ['clientX', 'clientY', 'pageX', 'pageY'].forEach(function(property) {
          event[property] = event.originalEvent.changedTouches[0][property];
        })

        // let jQuery handle the triggering of "doubletap" event handlers
        handleObj.handler.apply(this, arguments);
      } else {
        targetData.lastTouch = now;
      }
    }
  };

})(jQuery);


$(document).ready(function() {

// check if device is touch screen
var TOUCHSCREEN = ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0);

//	-- 		Object Slider value 	--	//

// Adjust slider
$(".obj-slider").each(function() {
	var THIS = $(this);
	var OBJECT = $(this).closest(".object");

	var setValue = parseInt($(".counter", THIS).text());
	$(".counter", THIS).text(setValue + " %");

	$(".slider-range-min", THIS).slider({
		range: "min",
		value: setValue,
		min: 0,
		max: 100,
		slide: function( event, ui ) {
			if( ui.value==0 )
				$(".counter", THIS).text("OFF");
			else
				$(".counter", THIS).text( ui.value + " %" );
		},
		stop: function(event, ui) {
			if( $(OBJECT).hasClass("turn-on") ) {
				var objName = $(OBJECT).find(".obj-header").html();
				UpdateObject(objName.toString(), "amplitude=" + ui.value);
			}
		}
	});
	
});

$(".object:not('.obj-send')").each(function() {
	SetTimerProgress($(this).find(".obj-timer"));
});

//	--		Object Timer 	--	//

if( ! TOUCHSCREEN ) {	// Not loaded on TOUCHSCREEN

// Turn on
$(".obj-timer").on("click",function(e) {
	var OBJECT = $(this).closest(".object");
	TurnOn(OBJECT);
});

// Turn off
$(".obj-off").on("click",function() {
	var OBJECT = $(this).closest(".object");
	TurnOff(OBJECT);
});

} // End not loaced TOUCHSCREEN


// Timer : on/off
$(".obj-timer-set .obj-timer-on").on("click", function(e) {
	e.stopPropagation();
	var Timer = $(this).closest(".obj-timer-set");
	if( $(Timer).hasClass("timer-on") && $(Timer).hasClass("timer-edit") ){
		$(Timer).removeClass("timer-edit");
		SetTimer($(Timer).closest(".object"));
	}
	else 
		if( $(Timer).hasClass("timer-on") && ! $(Timer).hasClass("timer-edit") )
			ClearTimer($(Timer).closest(".object"));
		else {
			$(Timer).toggleClass("timer-on").removeClass("timer-edit");
			SetTimer($(Timer).closest(".object"));
		}
})

if( ! TOUCHSCREEN ) {
// Timer : Edit
$(".obj-timer-set .obj-timer-edit").on("click", function(e) {
	e.stopPropagation();
	var Timer = $(this).closest(".obj-timer-set");
	$(Timer).toggleClass("timer-edit");
	$(Timer).find(".obj-timer-val").focus();
	if( ! $(Timer).hasClass("timer-edit") && $(Timer).hasClass("timer-on") ) {
  		var ObjTimer = $(Timer).closest(".obj-timer");
		SetTimer($(Timer).closest(".object"));
	}
});

}

// Set timer for object : time_set - time_current (minute)
function SetTimerProgress(OBJECT) {

	var str = $(OBJECT).find(".obj-timer-val").val();

	if( str=='NULL' || !str ) return 0;

	var objectSet = $(OBJECT).find(".progress-bar");
	var dt = new Date();
	var time_curr =  dt.getHours()*60 + dt.getMinutes();

	var n = str.indexOf('h');
	if(n<0) {
		$(OBJECT).find(".obj-timer-val").val("");
		AlertBox("Wrong timer, timer sample : 10h30");
		return 0;
	}

	var m = str.indexOf('\'');
	if(m<0)	m = str.length - 1;

	var hour = parseInt( str.substr(0, n) ); 
	var minute = parseInt( str.substr(n+1, m) );

	if(isNaN(hour))
		hour = 0;
	if(isNaN(minute))
		minute = 0;

	var time_set = hour*60 + minute;

	if(time_set>1440) {
		time_set = 1440;
		$(OBJECT).find(".obj-timer-val").val("24h");
	}
	else if(time_set<0){
		time_set = 0;
		$(OBJECT).find(".obj-timer-val").val("");
	}

	// Get the rest of timer
	if(time_set <= time_curr)
		time_set = ( time_set + 1440 ) - time_curr;
	else
		time_set = time_set - time_curr;

	var r = objectSet.attr('r');
	var pct = ((1440-time_set)/1440)*Math.PI*(r*2);
	objectSet.css({ strokeDashoffset: pct});

	return str;
}

function SetTimer(OBJECT) {
	var str = SetTimerProgress(OBJECT);
	var objName = $(OBJECT).find(".obj-header").html();
	
	if(str)
		UpdateObject(objName.toString(), "timer='"+str+"'");
}

function ClearTimer(OBJECT) {
	$(OBJECT).find(".obj-timer-val").val("");
	var objectSet = $(OBJECT).find(".progress-bar");
	var r = objectSet.attr('r');
	objectSet.css({ strokeDashoffset: Math.PI*(r*2)});
	$(".obj-timer-set", OBJECT).removeClass("timer-on timer-edit");

	var objName = $(OBJECT).find(".obj-header").html();
	UpdateObject(objName.toString(), "timer=NULL");
}

//	--	Object Switch 	--	//	

// 	Turn on/off by switch

$(".switch-button:not('.type-turn')").on("click", function() {
	$(this).toggleClass("switch-on");
	var OBJECT = $(this).closest(".object");
	if($(this).hasClass("switch-on"))
		TurnOn(OBJECT);
	else
		TurnOff(OBJECT);
});

$(".switch-button.type-turn").on("click", function(){
	$(this).toggleClass("switch-on");
});

// button submit
$(".submit-button").on("click", function(){
	var OBJECT = $(this).closest(".object");
	var name = $(OBJECT).find("input[name='name']").val();
	if( !name ) {
		AlertBox("Enter name");
		return 0;
	}
	var status = $(OBJECT).find("input[name='state']").val();
	if( !status ) {
		AlertBox("Enter state");
		return 0;
	}
	SendSpecialState( name + ":" + status );
});
///////////////////////////////////////////

if( TOUCHSCREEN ) { // Load on TOUCHSCREEN

	$(".lazy-man").addClass("touch-device");

	$(".obj-timer").on("touchstart",function() {
		$(this).find(".obj-timer-val").prop('disabled', true);
		var OBJECT = $(this).closest(".object");
		TurnOn(OBJECT);
	});

	$(".obj-off").on("touchstart",function() {
		var OBJECT = $(this).closest(".object");
		TurnOff(OBJECT);
	});

	$(".obj-timer-set .obj-timer-edit").on("click", function(e) {
		e.stopPropagation();
		var Timer = $(this).closest(".obj-timer-set");
		$(Timer).toggleClass("timer-edit");
		if( $(Timer).hasClass("timer-edit") ) {
			$(Timer).find(".obj-timer-val").prop('disabled', false);
			$(Timer).find(".obj-timer-val").focus();
		}
		else
			$(Timer).find(".obj-timer-val").prop('disabled', true);
		
		if( ! $(Timer).hasClass("timer-edit") && $(Timer).hasClass("timer-on") )
			SetTimer((Timer).closest(".object"));
	});
} // End load on TOUCHSCREEN

// Function turn on
function TurnOn(OBJECT) {
	if( $(OBJECT).hasClass("turn-on") )
		return;

	$(OBJECT).addClass("turn-on").find(".switch-button:not('.type-turn')").addClass("switch-on");
	var objName = $(OBJECT).find(".obj-header").html();

	if($(OBJECT).hasClass("obj-slider")) {
		var amplitude = parseInt($(OBJECT).find(".counter").html());
		UpdateObject(objName.toString(), "state=1,amplitude=" + amplitude);
	}else
		UpdateObject(objName.toString(), "state=1");
	
}
// Function turn off
function TurnOff(OBJECT) {
	$(OBJECT).removeClass("turn-on");
	ClearTimer(OBJECT);
	var objName = $(OBJECT).find(".obj-header").html();
	UpdateObject(objName.toString(), "state=0");
}

// update info of object to server

function UpdateObject(objName, strUpdate) {
	$.post(
		"function/data.php",
		{
			type : "update",
			name : objName,
			update : strUpdate
		}
	)
}

// Function send special state
function SendSpecialState(status) {
	$.post(
		"function/data.php",
		{
			type : "status",
			state : status
		}
	)
}

// function alert

function AlertBox(message) {
	$(".log-box").addClass("log-show");
	$(".log-box .log-text").html(message);
	setTimeout(function(){
		$(".log-box").removeClass('log-show');
	}, 5000);
}

});


