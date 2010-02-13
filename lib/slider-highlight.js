/**
 * jQuery.slider_highlight - jQuery UI slider range highlighting
 * Written by Chris Beer <chris_beer@wgbh.org>
 * Licensed under the MIT License.
 * Date: 2009/11/01
 *
 * @author Chris Beer
 * @version 0.1
 *
 * Add this css style: .highlight { position: absolute; height: 100%; background-color: rgba(0,0,255, 0.5);}
 **/

(function($) {
	$.fn.slider_highlight = function(options) {
		options = $.extend({event: 'slider:highlight', class: 'highlight', autohide: true}, options);
		
		$(this).append('<div class="' + options.class + '"></div>');
		
		if(options.autohide) {
			h = $('.'  + options.class, this).hide();
		}
		$(this).bind(options.event, function(event, data) {
			if(options.autohide && (typeof data == 'undefined' || data.begin == data.end)) { $('.'  + options.class).hide(); return; }
			$('.'  + options.class).css({left: (100*data.begin/$(this).slider('option', 'max')) + "%", width: 100*(data.end-data.begin)/$(this).slider('option', 'max') + "%"})
			if(options.autohide) {
				$('.'  + options.class).show();
			}
		});
	}
	
})(jQuery);
