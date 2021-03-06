
/* Media Functions */

var video_loaded = false;
$(function() { $('#annotation').hide(); });
function load_media(url, options) {
	if( video_loaded ) { return; }
	video_loaded = true;
	
	def = {'src': url, 'width': 320, 'height': 255, 'controller': false, 'qt_begin': media_init };
    
    opt = {};
    if(typeof options != "undefined") {
         opt = $.extend(def, options);
    } else {
         opt = def;                
    }
    
    $('#video').media(opt);
}

function media_init(obj, e) {
	$('#header form input').each(function() { $(this).get(0).disabled = true; });
	$(obj).clip();
	$(obj).scrubbar({poll: function() { e = qt($('embed')); if(typeof e.GetTime != 'function') { return 0; } return e.GetTime() / e.GetTimeScale(); } });
	$('.playbutton').bind('click', function() { qt($('embed')).Play(); });
	$('.pausebutton').bind('click', function() { qt($('embed')).Stop(); });
	$('input.clip_in').bind('change', function() { $('.mark_clip_in').val($(this).val())});
	$('input.clip_out').bind('change', function() { $('.mark_clip_out').val($(this).val())})
	
	$('.mark_clip_in').bind('change', function() { $('input.clip_in').val($(this).val()).change(); });
	$('.mark_clip_out').bind('change', function() { $('input.clip_out').val($(this).val()).change(); });
	$('#annotation').show();	
}

/* Sync functions */

function markIn(t) {
    if(t == null) {
    	t = $.media.convertTime(qt($('embed')).GetTime() / qt($('embed')).GetTimeScale());
    }  
    
    $('input.clip_in').val(t.substring(0,10)).change();
    
}
function markOut(t) {
    if(t == null) {
    	t = $.media.convertTime(qt($('embed')).GetTime() / qt($('embed')).GetTimeScale());
    }  
    $('input.clip_out').val(t.substring(0,10)).change();
  //  $('input.clip_in').change();
}

function markReset() {
	 $('input.clip_in').val('00:00:00').change();
	 $('input.clip_out').val($('.duration').val()).change();
}

function jump(s) {
	t = qt($('embed')).GetTime() + s * qt($('embed')).GetTimeScale();
	qt($('embed')).SetTime(t);
}

$(function() {
	$('#annotation_form').bind('submit', function() { 
		do_annotation(this); 
		markReset(); $('#new_annotation').hide(); 
		$(this).closest('form').get(0).reset(); $('#video').removeClass('annotation-mode');
		return false; });
		
	
	$('#header form input').each(function() { $(this).get(0).disabled = false; });
});

function do_annotation(obj) {
	div = $('<div class="note"></div>');
	div.append($('textarea', obj).val());
	div.attr('smil:begin', $('input.clip_in').val());
	div.attr('smil:end', $('input.clip_out').val());
	
	s = $('<span class="time"><a class="sync" href="" onclick="return false;">[sync]</a> </span>').prependTo(div).append(div.attr('smil:begin').substring(0,10));
	
	if(div.attr('smil:end') != '') {
		s.append(' - ' + div.attr('smil:end').substring(0,10));
	}
	
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
	qt($('embed')).SetTime($.media.convertTimestamp($(this).closest('div').attr('smil:begin')) * qt($('embed')).GetTimeScale() );
	qt($('embed')).Play();
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
        