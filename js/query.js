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


$(document).ready(function(){

var mobile = ! ( (typeof window.orientation !== 'undefined') || ! ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) );

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

if( ! mobile ) {	// Not loaded on mobile

// -- 	Turn on
$('.object .obj-timer').on("click",function() {
	$(this).closest(".object").addClass("turn-on");
	$(this).siblings(".switch-button:not('.type-turn')").first().addClass("switch-on");
});

// --	Turn off
$('.object .obj-timer').on("dblclick",function() {
	$(this).closest(".object").removeClass("turn-on");
	$(this).siblings(".switch-button:not('.type-turn')").first().removeClass("switch-on");
	ClearTimer($(this).closest(".obj-timer"));
});

// --	prevent parent click
$(".obj-timer-set .obj-timer-on, .obj-timer-set .obj-timer-edit").dblclick(function(e) {
	e.stopPropagation();
});

} // End not loaced mobile


// -- 	Timer : on/off
$(".obj-timer-set .obj-timer-on").click(function(e) {
	var Timer = $(this).closest(".obj-timer-set");
	if( $(Timer).hasClass("timer-on") && $(Timer).hasClass("timer-edit") ){
		$(Timer).removeClass("timer-edit");
		SetTimerProgress($(Timer).closest(".obj-timer"));
	}
	else 
		if( $(Timer).hasClass("timer-on") && ! $(Timer).hasClass("timer-edit") )
			ClearTimer($(Timer).closest(".obj-timer"));
		else {
			$(Timer).toggleClass("timer-on").removeClass("timer-edit");
			SetTimerProgress($(Timer).closest(".obj-timer"));
		}
})

// --	Timer : Edit
$(".obj-timer-set .obj-timer-edit").click(function(e) {
	var Timer = $(this).closest(".obj-timer-set");
	$(Timer).toggleClass("timer-edit");
	$(this).siblings(".obj-timer-val").first().focus();
	if( ! $(Timer).hasClass("timer-edit") && $(Timer).hasClass("timer-on") ) {
  		var ObjTimer = $(Timer).closest(".obj-timer");
		SetTimerProgress(ObjTimer);
	}

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

if( mobile ) { // Load on mobile

	$('.object .obj-timer').on("touchstart",function() {
		$(this).closest(".object").addClass("turn-on");
		$(this).siblings(".switch-button:not('.type-turn')").first().addClass("switch-on");
	});

	$('.object .obj-timer').on("doubletap", function(){
		$(this).closest(".object").removeClass("turn-on");
		$(this).siblings(".switch-button:not('.type-turn')").first().removeClass("switch-on");
		ClearTimer($(this).closest(".obj-timer"));
	});

	$(".obj-timer-set .obj-timer-on, .obj-timer-set .obj-timer-edit").on("doubletap",function(e) {
		e.stopPropagation();
	});

} // End load on mobile


});


