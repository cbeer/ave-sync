(function($) {
	$.fn.media = function(options) {
		options = $.extend({}, $.fn.media.options, options);
		var str = QT_GenerateOBJECTText_XHTML(options.src, options.width, options.height, '',
			'autostart', options.autostart,
						'postdomevents', 'true',
						'EnableJavaScript', 'true',
						'bgcolor', options.bgcolor,
						'controller', options.controller,
						'SCALE', 'aspect',
						'obj#ID', 'videoplayer',
						'emb#ID', 'video_embed',
						'obj#NAME', 'video',
						'emb#NAME', 'videoplayer',
						'showlogo',  'true',
						'LOOP', 'false'
					);
		$('.placeholder',  this).replaceWith(str);	

		var _m = $(this);
 
		_m.bind('qt_begin', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_canplay', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_canplaythrough', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_durationchange', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_error', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_ended', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_play', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_pause', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_timechanged', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_load', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_progress', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_waiting', {that: _m, options: options}, $.fn.media.handler);
		_m.bind('qt_stalled', {that: _m, options: options}, $.fn.media.handler);
	},
	$.fn.media.handler = function(e) {
		if (typeof e.data.options[e.type] != "undefined") {
			e.data.options[e.type](e.data.that, e);
		}
		class_list = "qt-play qt-pause qt-ended qt-begin qt-error";
		switch(e.type) {
			case 'qt_begin':
				$(e.data.that).removeClass(class_list).addClass('qt-begin');
				if(e.data.options.start != "undefined") {
					el = $('embed', e.data.that)[0];
					el.SetStartTime(e.data.options.start * el.GetTimeScale());
					el.Stop(); el.Play();
					//el.SetTime(e.data.options.start * el.GetTimeScale());
				}
				break;
			case 'qt_ended':
				$(e.data.that).removeClass(class_list).addClass('qt-ended');
				break;
			case 'qt_error':
				$(e.data.that).removeClass(class_list).addClass('qt-error');
				break;
			case 'qt_play':
				if(e.data.options.start != "undefined") { el = $('embed', e.data.that)[0]; el.SetStartTime(0); }
				$(e.data.that).removeClass(class_list).addClass('qt-play');
				break;
			case 'qt_pause':
				$(e.data.that).removeClass(class_list).addClass('qt-pause');
				break;
		
		}
	},
	$.fn.media.options = {'autostart': true, 'bgcolor': 'black', 'controller': false};
})(jQuery);


function qt(obj) {

	if(typeof obj.get(0).GetTime == 'function') {
		return obj.get(0);
	}
	
	if(typeof obj.parent().get(0).GetTime == 'function') {
		return obj.parent().get(0);
	}
}
