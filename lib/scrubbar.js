/**
 * jQuery.scrubbar - Multimedia scrubbar for jQuery
 * Written by Chris Beer <chris_beer@wgbh.org>
 * Licensed under the MIT License.
 * Date: 2009/11/01
 *
 * @author Chris Beer
 * @version 0.1
 *
 **/

(function($) {
	$.fn.scrubbar = function(options) {
		that = this;
		options = $.extend({event: 'media:tick', poll:  false, pollingInterval: '1s', source: { clip_in: $('input.clip_in', that), clip_out: $('input.clip_out', that), duration: $('input.duration', that)}}, options);
//		$(this).append('<div class="scrubbar"></div>');
		$('.scrubbar', this).slider({values: [$.media.convertTimestamp(options.source.clip_in.val()), 0, $.media.convertTimestamp(options.source.clip_out.val())], min: 0, max: $.media.convertTimestamp(options.source.duration.val()), slide: $.fn.scrubbar.change, change: $.fn.scrubbar.change});
		options.source.clip_in.change(function() { 
			$('.scrubbar', that).slider('values', 0, $.media.convertTimestamp($(this).val()));
			$('.scrubbar', that).trigger('slider:range', {begin: $.media.convertTimestamp($(options.source.clip_in).val()), end: $.media.convertTimestamp($(options.source.clip_out).val())});
		});
		$('.scrubbar .ui-slider-handle:nth-child(1)', this).addClass('clip_in').bind('dblclick', function() { });
		$('.scrubbar .ui-slider-handle:nth-child(2)', this).addClass('playhead');
		$('.scrubbar .ui-slider-handle:nth-child(3)', this).addClass('clip_out').bind('dblclick', function() { });
		options.source.clip_out.change(function() { $('.scrubbar', that).slider('values', 2, $.media.convertTimestamp($(this).val()));});
		$('.scrubbar', that).trigger('slider:range', {begin: $.media.convertTimestamp($(options.source.clip_in).val()), end: $.media.convertTimestamp($(options.source.clip_out).val())});
		/*
		if(options.event) {
            $('.scrubbar').bind(options.event, function(e, d) {
                    $(this).slider('values', 1, $.fn.sync.timestamp_to_s(d.time));
            });
        }*/

        if(options.poll != false) {
            $('.scrubbar', this).everyTime(options.pollingInterval, function() {
                    $(this).slider('values', 1, options.poll());
                    $('.timestamp').html($.media.convertTime($(this).slider('values', 1)).substring(0,8));
            });
        }
        if(typeof $('.scrubbar', this).slider_highlight == 'function') {
        	$('.scrubbar', this).slider_highlight({event: 'slider:highlight', class: 'highlight'});
        	$('.scrubbar', this).slider_highlight({event: 'slider:range', class: 'range', autohide: false});
		}
		
		return this;
	},
	$.fn.scrubbar.change = function(event, ui) {
		if(typeof event.originalEvent == 'undefined') {
			return;
		}
		that = $(this).closest('.video');
		c_in = $('input.clip_in', that).val();
		if(c_in != $.media.convertTime(ui.values[0])) {
			$('input.clip_in', that).val($.media.convertTime(ui.values[0])).change();
			if(ui.values[0] > ui.values[1]) {
				$(this).slider('values', 1, ui.values[0]);
			}
		}
		c_out = $('input.clip_out', that).val();
		if(c_out != $.media.convertTime(ui.values[2])) {
			$('input.clip_out', that).val($.media.convertTime(ui.values[2])).change();
			if(ui.values[2] < ui.values[1]) {
				$(this).slider('values', 1, ui.values[2]);
			}
		}
		

		if($('.ui-state-focus.playhead', this).length > 0 && c_in == $.media.convertTime(ui.values[0]) && c_out == $.media.convertTime(ui.values[2])) {
			e = $('embed', that)[0];
			e.SetTime(ui.values[1] * e.GetTimeScale());
		//	e.Stop(); e.Play();
		//	$f('video').seek(ui.values[1]);
		//	$('.clip_in').val($(this).slider('values', 1));
		} else {
			$(this).trigger('slider:range', {begin: ui.values[0], end: ui.values[2]});
		}
	},
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
	
})(jQuery);
