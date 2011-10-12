//Relative
(function($){
    
  var defaults = {
    format: "%dd:%hh:%mm:%ss",
    tick: 990
  };

  var patterns = [
    /%ss/,
    /%mm/,
    /%hh/,
    /%dd/,
    /%s/,
    /%m/,
    /%h/,
    /%d/,
    /%SECONDS/,
    /%MINUTES/,
    /%HOURS/,
    /%DAYS/
  ];

  function calcage(secs, num1, num2) {
    return ((Math.floor(secs/num1))%num2);
  };
  
  function addLeadingZeros(number, length) {        
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };

  function pluralize(count, singular, plural){
    if (plural == null){
      plural = singular + 's';
    }
    return (count < 1 ? singular : plural);
  };

  function humanTime(seconds){
    var text = "";

    var minutes = Math.floor(seconds / 60);

    if (seconds <= 1) { text = '1 second ago'; } else
    if (seconds <= 59) { text = seconds + ' seconds ago'; } else
    if (minutes === 1) { text = 'A minute ago'; } else
    if (minutes < 45) { text = minutes + ' minutes ago'; } else
    if (minutes < 90) { text = 'About 1 hour ago'; } else
    if (minutes < 1440) { text = 'About ' + Math.floor(minutes / 60) + ' hours ago'; } else
    if (minutes < 2880) { text = '1 day ago'; } else
    if (minutes < 43200) { text = Math.floor(minutes / 1440) + ' days ago'; } else
    if (minutes < 86400) { text = 'About 1 month ago'; } else
    if (minutes < 525960) { text = Math.floor(minutes / 43200) + ' months ago'; } else
    if (minutes < 1051199) { text = 'About 1 year ago'; } else {
      text = 'Over ' + Math.floor(minutes / 525960) + ' years ago';  
    }

    return text;

  };

  function formatTime(secondsRemaining, format){
    
    var remaining = {
      days: calcage(secondsRemaining, 86400, 100000),
      hours: calcage(secondsRemaining, 3600, 24),
      minutes: calcage(secondsRemaining, 60, 60),
      seconds: calcage(secondsRemaining, 1, 60)
    };

    var replacements = [
      addLeadingZeros(remaining.seconds, 2),
      addLeadingZeros(remaining.minutes, 2),
      addLeadingZeros(remaining.hours, 2),
      addLeadingZeros(remaining.days, 2),
      remaining.seconds,
      remaining.minutes,
      remaining.hours,
      remaining.days,
      pluralize(remaining.seconds, "Second"),
      pluralize(remaining.minutes, "Minute"),
      pluralize(remaining.hours, "Hour"),
      pluralize(remaining.days, "Day")
    ];

    var text = format;
  
    for(i = 0; i <= patterns.length-1; i++ ){
     
      tmp = text.replace(patterns[i], replacements[i]);
      
      text = tmp;
      
    }
     
    return text; 
  }

  var methods = {
    init: function(options) {
      //Merge Options With Defaults
      var settings = $.extend({}, defaults, options);

      return this.each(function(){

        //Setup Variables
        var $this = $(this), //jQuery Object
            self = $this, //self can be passed to anonymous functions
            data = $this.data('relative'); //Store data about the plugin
  
        //Plugin Has Not Been Intialized Yet
        if(!data){
          setupData = {
            target : $this,
            options : settings,
            time : new Date(Date.parse($(this).attr('datetime')))
          }

          if(settings.tick > 0){ 
            setupData.timer = setInterval(function() { self.relative('update'); }, settings.tick);
          }

          //Setup Plugin Data
          $this.data('relative', setupData);

          //Intialization Logic
          $this.relative('update');
        }
      });
    },
    update: function() {
      //Setup Variables
      var $this = $(this),
          self = $this,
          data = $this.data('relative');
      
      //Method Logic  
      return this.each(function(){

        //https://gist.github.com/58761
        //and
        //http://37signals.com/svn/posts/1557-javascript-makes-relative-times-compatible-with-caching
        var then =  data.time;
        var now =  new Date();
        
        if(now.valueOf() > then.valueOf()){
          var diff = now.valueOf() - then.valueOf();//date in the past
        } else {
          var diff = then.valueOf() - now.valueOf();//date in the future
        }
        
        var seconds = Math.floor(diff / 1000);
        
        if(data.options.format == "human"){
          $(this).text(humanTime(seconds));
        } else {
          $(this).text(formatTime(seconds, data.options.format));
        }
        
      });
    },
    start: function() {
      return this.each(function(){
        var $this = $(this),
            self = $this,
            data = $this.data('countdown');
        if(data.timer){
          clearInterval(data.timer);
        }
        data.timer = setInterval(function() { self.relative('update'); }, data.options.tick);
      });
    },
    destroy: function(){
      return this.each(function(){
        var data = $(this).data('countdown');
        clearInterval(data.timer);
        $this.removeData();
      });
    },
    stop: function() {
      return this.each(function(){
        var data = $(this).data('countdown');
        clearInterval(data.timer);
      });
    }
  };

  $.fn.relative = function( method ) {
    
    // Method Calling Logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.relative' );
    }    
  
  };

})(jQuery);

$(function() {
  $('time[data-relativize]').each(function(){
    var format = $(this).data('relativize') || "%dd:%hh:%mm:%ss";
    $(this).relative({format:format});
  });
});  

//Make Date.parse() understand ISO 8061 dates
//===========================================
/**
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function (Date, undefined) {
    var origParse = Date.parse, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];
    Date.parse = function (date) {
        var timestamp, struct, minutesOffset = 0;

        // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
        // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
        // implementations could be faster
        //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
        if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
            // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
            for (var i = 0, k; (k = numericKeys[i]); ++i) {
                struct[k] = +struct[k] || 0;
            }

            // allow undefined days and months
            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;

            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
        }
        else {
            timestamp = origParse ? origParse(date) : NaN;
        }

        return timestamp;
    };
}(Date));