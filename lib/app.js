
var source;
var SYNCHRONIZABLE_ELEMENTS = 'seg,incident';

function showXML() {
	$('#output').show();
		
	tmp = add_alignment_to($(source), $('.media.text'));
	
	$(tmp).find(SYNCHRONIZABLE_ELEMENTS).filter(function() { return $(this).attr('xml:id').substring(0, 2) == '__'; });
	
	s = new XMLSerializer();  
	str = s.serializeToString(tmp[0]);
	
	$('#output textarea').val(str);
}


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
}

/* Text Functions */

function load_transcript(url) {
	 $.get(url, function(data) { source = parse_transcript(data); }, 'xml');
}

function parse_transcript(data) {
	output = $(data);
	
	people = {};
	output.find('person').each(function() {
		people[$(this).attr('xml:id')] = $(this).text().trim();
	});
	
	output.find(SYNCHRONIZABLE_ELEMENTS).filter(function() { return !$(this).attr('xml:id'); }).each(function() { v = generate_id(this); $(this).attr('xml:id', v); });
	
	$('.media.text').html('<table><thead><tr><th>In</th><th>Out</th><th>Text</th></thead><tbody></tbody></table>');
	
	output.find(SYNCHRONIZABLE_ELEMENTS).each(function() {
		tr = $('<tr></tr>');
		tr.attr('smil:begin', $(this).attr('smil:begin'));
		tr.attr('smil:end', $(this).attr('smil:end'));
		tr.attr('id', $(this).attr('xml:id'));
		
		tr.append('<td><input class="begin" type="text" value="' + ($(this).attr('smil:begin') || '') +'"/></td>');
		tr.append('<td><input class="end" type="text" value="' + ($(this).attr('smil:end') || '') +'"/></td>');
		body = $('<td></td>').appendTo(tr);
		
		who = $(this).closest('u').attr('who');
		
		if(who != undefined) {
			body.append('<strong>' + people[who.substring(1)] + ':</strong>');
		} 
		
		body.append($(this)[0].textContent);
		
		tr.appendTo($('.media.text tbody'));
		
		
	});
	
	select($('tr:first-child'));
	
	$('td').bind('click', function() {
		select($(this).closest('tr'));
	});
	
	$('td input').bind('focus', function() {
		select($(this).closest('tr'));
	});
	
	$('tr').sync($('.video'), {poll: function() { return $('embed')[0].GetTime() / $('embed')[0].GetTimeScale(); }});
	
	return output;
}


function add_alignment_to(src, data) {
	output = src;
	
	output.find(SYNCHRONIZABLE_ELEMENTS).each(function() {
		d = $('#' + $(this).attr('xml:id'));
		$(this).attr('smil:begin', $('.begin', d).val());
		$(this).attr('smil:end', $('.end', d).val());
	});
	
	return output;
}

var i = 0;

function generate_id(el) {
	return '__' + el.nodeName + i++;
}


/* Sync functions */

function markIn(t) {
    if(t == null) {
    	t = $.media.convertTime($('embed')[0].GetTime() / $('embed')[0].GetTimeScale());
    }  
    tr = $('.text .current');
    $('.begin',tr ).val(t.substr(0,12));
    $('.end',tr )[0].focus();
	tr.attr('smil:begin', $('.begin', tr).val());
  //  $('.text tbody').scrollTo('.current',  500, {offset: {top: '-50px'}});
}
function markOut(t) {
    if(t == null) {
    	t = $.media.convertTime($('embed')[0].GetTime() / $('embed')[0].GetTimeScale());
    }  
    tr = $('.text .current');
    $('.end',tr ).val(t.substr(0,12));
	tr.attr('smil:end', $('.end', tr).val());
    
        
    n = tr.next();
    select(n);
    markIn(t);
}
function preview(w) {
	if(arguments.length) {
		select($('.text .current').prev(), true);
		if($('.text .current .begin').val() != "") {
	        	t = $.media.convertTimestamp($('.current .begin').val());
	        	$('embed')[0].SetTime(t * $('embed')[0].GetTimeScale());
		}
	} else {
		if($('.text .current .begin').val() != "") {
	        	t =  $.media.convertTimestamp($('.current .begin', tr).val());
	        	$('embed')[0].SetTime(t * $('embed')[0].GetTimeScale());
		}
	}
}

function update(e) {
    var tr = $(e).closest('tr');
	tr.attr('smil:begin', $('.begin', tr).val());
	tr.attr('smil:end', $('.end', tr).val());
}

function select(tr) {
    $('.text  .current').removeClass('current');
    tr.addClass('current');
    
    $('.text').scrollTo('.current',  500, {offset: {top: '-50px'}});
    
}
function jump(s) {
	t = $('embed')[0].GetTime() + s * $('embed')[0].GetTimeScale();
	$('embed')[0].SetTime(t);
}

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
        