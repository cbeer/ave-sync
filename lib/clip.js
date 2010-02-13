/**
 * jQuery.clip - Multimedia segmenting for jQuery
 * Written by Chris Beer <chris_beer@wgbh.org>
 * Licensed under the MIT License.
 * Date: 2009/10/24
 *
 * @author Chris Beer
 * @version 0.1
 *
 **/

(function($) {
	$.fn.clip = function(options) {
		options = $.extend({event: 'media:clip', poll:  false, pollingInterval: '1s', reverse: false}, options);
		$(this).clip_video(options);
		return this;
	},
	
	$.fn.clip_video = function(options) {
		//in, out
		clip_in = '<input name="clip_in" type="text" value="" class="clip_in">';
		clip_out = '<input name="clip_out" type="text" value="" class="clip_out">';
		duration = '<input name="duration" type="text" value="" class="duration">';
		tools = '<div id="' + $(this).attr('id') + '_tools" class="clip_metadata">' + clip_in + clip_out + duration + '</div>';
		$(this).append(tools);
		options.tools = $('.clip_metadata', this);
		that = this;
		$('input[name="comment[metadata]"]').each(function(i, e) {
			if($(this).val() != '') {
			e = $.evalJSON($(this).val());
			
			$('.clip_in', options.tools).val(e.clip_in);
			$('.clip_out', options.tools).val(e.clip_out);
			}
		});
		
		$('input[name="comment[metadata]"]').closest('form').submit(function() {
			e = {clip_in: $('.clip_in', options.tools).val(), clip_out: $('.clip_out', options.tools).val()} 
			$('input[name="comment[metadata]"]', this).val($.toJSON(e));
		});
		
		$(this).clip_video_qt(options);
		return this;
	},
	
	$.fn.clip_video_fp = function(options) {
		video = $f('player');
		
	//	$(this).everyTime(options.pollingInterval, function() {
			scale = 1;
			clip_in = 0;
			duration = video.getClip().duration;
			clip_out = duration;
 			if(clip_out > duration) { clip_out = duration; }
			$('input.clip_in', options.tools).val($.media.convertTime(clip_in).substring(0,8));
			$('input.clip_out', options.tools).val($.media.convertTime(clip_out).substring(0,8));
			$('input.duration', options.tools).val($.media.convertTime(duration).substring(0,8));
	//	});
	$(this).everyTime(options.pollingInterval, function() {
		if($.media.convertTimestamp($('input.clip_in').val()) - 1> t) {
			video.pause();		
			video.seek($.media.convertTimestamp($('input.clip_in').val()));
		
		}
		if($.media.convertTimestamp($('input.clip_out').val()) + 1< t) {
			video.pause();		
			video.seek($.media.convertTimestamp($('input.clip_out').val()));
		}
	});
//		$('input.clip_in', options.tools).change(function() { video.start = $.media.convertTimestamp($(this).val()) ; });	
//		$('input.clip_out', options.tools).change(function() { video.duration = $.media.convertTimestamp($(this).val()) - video.start;});	
		
		$('input.clip_in', options.tools).add('input.clip_out', options.tools).change(function() { $(options.tools).next('.scrubbar').trigger('slider:range', {begin: $.media.convertTimestamp($(this).parent().find('.clip_in').val()), end: $.media.convertTimestamp($(this).parent().find('.clip_out').val())}); });
	},
	$.fn.clip_video_qt = function(options) {
		video = qt($('embed', this));
		
	//	$(this).everyTime(options.pollingInterval, function() {
			scale = video.GetTimeScale();
			clip_in = video.GetStartTime() / scale;
			clip_out = video.GetEndTime() / scale;
			duration = video.GetDuration() / scale;
			if(clip_out > duration) { clip_out = duration; }
			$('input.clip_in', options.tools).val($.media.convertTime(clip_in).substring(0,8));
			$('input.clip_out', options.tools).val($.media.convertTime(clip_out).substring(0,8));
			$('input.duration', options.tools).val($.media.convertTime(duration).substring(0,8));
	//	});
		$('input.clip_in', options.tools).change(function() { video.SetStartTime($.media.convertTimestamp($(this).val()) * video.GetTimeScale()); });	
		$('input.clip_out', options.tools).change(function() { video.SetEndTime($.media.convertTimestamp($(this).val()) * video.GetTimeScale()); });	
		$('input.clip_in', options.tools).add('input.clip_out', options.tools).change(function() { $(options.tools).next('.scrubbar').trigger('slider:range', {begin: $.media.convertTimestamp($(this).parent().find('.clip_in').val()), end: $.media.convertTimestamp($(this).parent().find('.clip_out').val())}); });
	},
	
	$.fn.clip_video_html5 = function(options) {
		
	},
	
	$.fn.clip_image = function(options) {
	
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
