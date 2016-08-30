$(document).ready(function(){

////////////////////////////////////////////
////		Object Slider Value 		////

// --	adjust slider
$(".obj-slider").each(function() {
	var THIS = $(this);
	var setValue = parseInt($(".counter", THIS).text());
	$(".counter", THIS).text(setValue + " %");

	$(".slider-range-min", THIS).slider({
	  range: "min",
	  value: setValue,
	  min: 0,
	  max: 100,
	  slide: function( event, ui ) {
	  	if( ui.value==0 )
	  		$(".counter", THIS).text( "OFF" );
	  	else
	    	$(".counter", THIS).text( ui.value + " %" );
	  }
	});
	
});

////		Finish Object Slider Value 		////
///////////////////////////////////////////////
/////////////////////////////////////
////		Object Timer 		////

// -- 	Turn on
$('.object .obj-timer').click(function() {
	$(this).closest(".object").addClass("turn-on");
	$(this).siblings(".switch-button:not('.type-turn')").eq(0).addClass("switch-on");
});

// --	Turn off
$('.object .obj-timer').dblclick(function() {
	$(this).closest(".object").removeClass("turn-on");
	$(this).siblings(".switch-button:not('.type-turn')").eq(0).removeClass("switch-on");
	ClearTimer($(this).closest(".obj-timer"));
});

// -- 	Timer : on/off
$(".obj-timer-set .obj-timer-on").click(function(e) {
	var Timer = $(this).closest(".obj-timer-set");
	$(Timer).toggleClass("timer-on").removeClass("timer-edit");
	if( ! $(Timer).hasClass("timer-on") ){
		ClearTimer($(Timer).closest(".obj-timer"));
	}else{
		SetTimerProgress($(Timer).closest(".obj-timer"));
	}
})

// --	Timer : Edit
$(".obj-timer-set .obj-timer-edit").click(function(e) {
	var Timer = $(this).closest(".obj-timer-set");
	$(Timer).toggleClass("timer-edit");
	if( ! $(Timer).hasClass("timer-edit") ) {
  		var ObjTimer = $(Timer).closest(".obj-timer");
		SetTimerProgress(ObjTimer);
	}

});

// --	prevent parent click
$(".obj-timer-set .obj-timer-on, .obj-timer-set .obj-timer-edit").dblclick(function(e) {
	e.stopPropagation();
});

// --	Set timer for object : time_set - time_current (minute)
function SetTimerProgress(circle) {

	var str = $(circle).find(".obj-timer-val").val();
	var objectSet = $(circle).find(".progress-bar");
	var dt = new Date();
	var time_curr =  dt.getHours()*60 + dt.getMinutes();

	var n = str.indexOf('h');
	if(n<0) n = str.length;

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
		$(circle).find(".obj-timer-val").val("24h")
	}
	else if(time_set<0){
		time_set = 0;
		$(circle).find(".obj-timer-val").val("0h")
	}

	// Get the rest of timer
	if(time_set <= time_curr)
		time_set = ( time_set + 1440 ) - time_curr;
	else
		time_set = time_set - time_curr;

	var r = objectSet.attr('r');
	var pct = ((1440-time_set)/1440)*Math.PI*(r*2);
	objectSet.css({ strokeDashoffset: pct});
}

function ClearTimer(ObjTimer) {
	$(ObjTimer).find(".obj-timer-val").val("0h");
	var objectSet = $(ObjTimer).find(".progress-bar");
	var r = objectSet.attr('r');
	objectSet.css({ strokeDashoffset: Math.PI*(r*2)});
	$(".obj-timer-set", ObjTimer).removeClass("timer-on timer-edit");
}

////		Finish Object Timer 		////
///////////////////////////////////////////
/////////////////////////////////////
////		Object Switch 		////

// --	turn on/off by switch

$(".object .switch-button").click(function(){
	$(this).toggleClass("switch-on");
	$(this).not(".type-turn").closest(".object").toggleClass("turn-on");
	if( !$(this).hasClass("type-turn") ){
		var ObjTimer = $(this).closest(".object").find(".obj-timer");
		ClearTimer(ObjTimer);
	}
});

////		Finish Object Switch 		////
///////////////////////////////////////////


});


