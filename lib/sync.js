/**
 * jQuery.sync - Multimedia synchronization for jQuery
 * Written by Chris Beer <chris_beer@wgbh.org>
 * Licensed under the MIT License.
 * Date: 2009/10/15
 *
 * @author Chris Beer
 * @version 0.1
 *
 **/

(function($) {
	/*
	example html5 poll + reverse:
	
	poll: function() { return $('video')[0].currentTime; }
	reverse: function(t) { $('video')[0].currentTime = t; }
	*/
	
	/**
	 * The synchronization function works on a jQuery element containing smil:begin and smil:end attributes. The timing driver can come from either a triggered event (the default), or by polling a function that returns the current time. 
	 *
	 * Reverse synchronization is also possible by providing a 'reverse' function that accepts the time (in seconds) to skip to. If it is operating in this mode, it will prepend a [sync] anchor, which may be manipulated accordingly by later processes.
	 */
	$.fn.sync = function(source, options) {
		options = $.extend({event: 'media:tick', poll:  false, pollingInterval: '1s', reverse: false}, options);
		$.fn.sync.reverse = options.reverse;
		$tc = $(this);
		$('.sync', this).remove();
		
		this.each(function() {
            $(this).attr('smil:begin', $.fn.sync.timestamp_to_s($(this).attr('smil:begin')));
            $(this).attr('smil:end', $.fn.sync.timestamp_to_s($(this).attr('smil:end')));
            
            if(options.reverse) {
            	$('<a class="sync" href="#" onclick="$.fn.sync.reverse(' +  $(this).attr('smil:begin')+ ', this); return false;">[sync]</a> ').prependTo(this).mouseover(function() { $('#scrubbar').trigger('slider:highlight', {begin: $(this).parent().attr('smil:begin'), end: $(this).parent().attr('smil:end')}); }).mouseout(function() { $('#scrubbar').trigger('slider:highlight'); });
            }
		});
		begin = '';
		this.each(function(i) {
			if($(this).attr('smil:begin') == '') {
				$(this).attr('smil:begin', begin);
			}
			begin = $(this).attr('smil:begin');
		});

		end = '';
		for(var i=this.length-1; i >=0; i--) {
			if($(this[i]).attr('smil:end') == '') {
				$(this[i]).attr('smil:end', end);
			}
			end = $(this[i]).attr('smil:end');
		};

		if(options.event) {
			source.bind(options.event, function(e, d) {
				$.fn.sync.tick($.fn.sync.timestamp_to_s(d.time), $tc);
			});
		}

		if(options.poll != false) {
			source.everyTime(options.pollingInterval, function() {
				t = options.poll();
				$.fn.sync.tick($.fn.sync.timestamp_to_s(t), $tc);
			});
		}

		return this;
	},      
	              
	$.fn.sync.timestamp_to_s = function(timestamp) {
	      var s = 0;
	      if(typeof timestamp != 'string' || timestamp.indexOf(':') == -1) { return timestamp; }
	      var t = timestamp.split(":");

	      s = parseFloat(t[2]);
	      s += $.fn.sync.trimParseInt(t[1]) * 60;
	      s += $.fn.sync.trimParseInt(t[0]) * 60*60;

	      return s;
	},
	
	$.fn.sync.tick = function(t, arr) {
		arr.each(function(i, e) {
			$e = $(e);
	
	        if($e.attr('smil:begin') <= t && t < $e.attr('smil:end')) {
	        	$.fn.sync.activate($e);
			} else if($e.hasClass('active')) {
				$.fn.sync.deactivate($e);
			}
		});
		
	},
	$.fn.sync.activate = function(e) {
	    e.addClass('active');
	    e.trigger('media:synced');
	},
	$.fn.sync.deactivate = function(e) {
	    e.removeClass('active');
	},
	$.fn.sync.trimParseInt = function(s) {
        if(s != undefined) {
            return s.replace(/^0+/,'');
        } else {
            return 0;
        }
    };
    $.fn.sync.poll_html5 = function() { return $('video')[0].currentTime; };
    $.fn.sync.reverse_html5 = function(t) { $('video')[0].currentTime = t; };
    
    $.fn.sync.poll_qt = function() { e = $(this)[0]; return e.GetTime()/e.GetTimeScale(); };
    $.fn.sync.reverse_qt = function(t) { e = $(this)[0]; e.SetTime(t * e.GetTimeScale()); };
})(jQuery);
