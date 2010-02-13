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
		options = $.extend({event: 'slider:highlight', selector: '.highlight', autohide: true}, options);
		
		if(options.autohide) {
			h = $(options.selector, this).hide();
		}
		$(this).bind(options.event, function(event, data) {
			if(options.autohide && (typeof data == 'undefined' || data.begin == data.end)) { $(options.selector).hide(); return; }
			$(options.selector).css({left: (100*data.begin/$(this).slider('option', 'max')) + "%", width: 100*(data.end-data.begin)/$(this).slider('option', 'max') + "%"})
			if(options.autohide) {
				$(options.selector).show();
			}
		});
	}
	
})(jQuery);
