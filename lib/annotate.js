
/* Media Functions */

var video_loaded = false;

function load_media(url, options) {
	if( video_loaded ) { return; }
	video_loaded = true;
	
	def = {'src': url, 'width': 320, 'height': 240, 'controller': true, 'qt_begin': media_init };
    
    opt = {};
    if(typeof options != "undefined") {
         opt = $.extend(def, options);
    } else {
         opt = def;                
    }
    
    $('#video').media(opt);
}

function media_init(obj, e) {
	$(obj).clip();
}

/* Sync functions */

function markIn(t) {
    if(t == null) {
    	t = $.media.convertTime($('embed')[0].GetTime() / $('embed')[0].GetTimeScale());
    }  
    
    $('.clip_in').val(t.substring(0,10));
    
}
function markOut(t) {
    if(t == null) {
    	t = $.media.convertTime($('embed')[0].GetTime() / $('embed')[0].GetTimeScale());
    }  
    $('.clip_out').val(t);
}

function reset() {
	 $('.clip_in').val('00:00:00');
	 $('.clip_out').val($('.duration').val());
	 
}

function jump(s) {
	t = $('embed')[0].GetTime() + s * $('embed')[0].GetTimeScale();
	$('embed')[0].SetTime(t);
}

$(function() {
	$('#annotation_form').bind('submit', function() { do_annotation(this); $('#new_annotation').hide(); return false; });
});

function do_annotation(obj) {
	div = $('<div></div>');
	div.append($('textarea', obj).val());
	div.attr('smil:begin', $('.clip_in').val());
	div.attr('smil:end', $('.clip_out').val());
	
	$('<span class="time"><a class="sync" href="" onclick="return false;">[sync]</a> </span>').prependTo(div).append(div.attr('smil:begin').substring(0,10));
	
	e = [];
	$('.annotations > div').each(function() { 
		if($.media.convertTimestamp($(this).attr('smil:begin')) > $.media.convertTimestamp(div.attr('smil:begin'))) {
			e = $(this);
			return false;	
		}
	});
	
	if(e.length > 0) {
		div.insertBefore(e);
	} else {
		$('.annotations').append(div);
	}
}

$('.sync').live('click', function() {
	$('embed')[0].SetTime($.media.convertTimestamp($(this).closest('div').attr('smil:begin')) * $('embed')[0].GetTimeScale() );
});

/* Utility Functions */

$.media = function() { };

$.media.convertTime = function(time) {
        var t = new Array(0,0,0);
        
        t[2] = time;
        
        if(t[2] >= 60) {
                t[1] = parseInt(t[2]/60);
                t[2] -= t[1]*60;
                
                if(t[1] >=60) {
                t[0] = parseInt(t[1]/60);
                t[1] -= t[0]*60;
                }
        }
        
        if(t[0] < 10) { t[0] = "0" + t[0];}
        if(t[1] < 10) { t[1] = "0" + t[1];}
        if(t[2] < 10) { t[2] = "0" + t[2];}
        
        return t.join(':');
};

$.media.convertTimestamp = function(timestamp) {
        var s = 0;
        if(typeof timestamp != 'string') { return timestamp; }
        var t = timestamp.split(":");
        
        s = parseFloat(t[2]);
        s += $.media.trimParseInt(t[1]) * 60;
        s += $.media.trimParseInt(t[0]) * 60*60;
        
        return s;
};

$.media.trimParseInt = function(s) {
        if(s != undefined) {
                return s.replace(/^0+/,'');
                } else {
                        return 0;
                }
        };
        