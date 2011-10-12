//Relative
(function($){
    
  var defaults = {
    tick: 990,
    onTick: null
  };

  var methods = {
    init: function(options) {
      //Merge Options With Defaults
      var settings = $.extend({}, settings, options );

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
            timer: setInterval(function() { self.relative('update'); }, data.options.tick);
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
        var render = "";
        var diff = now.valueOf() -then.valueOf();
        var seconds = Math.floor(diff.valueOf()/1000);
        var minutes = Math.floor(seconds / 60);

        if (seconds <= 1) { render = '1 second ago'; } else
        if (seconds <= 59) { render = seconds + ' seconds ago'; } else
        if (minutes === 1) { render = 'A minute ago'; } else
        if (minutes < 45) { render = minutes + ' minutes ago'; } else
        if (minutes < 90) { render = 'About 1 hour ago'; } else
        if (minutes < 1440) { render = 'About ' + Math.floor(minutes / 60) + ' hours ago'; } else
        if (minutes < 2880) { render = '1 day ago'; } else
        if (minutes < 43200) { render = Math.floor(minutes / 1440) + ' days ago'; } else
        if (minutes < 86400) { render = 'About 1 month ago'; } else
        if (minutes < 525960) { render = Math.floor(minutes / 43200) + ' months ago'; } else
        if (minutes < 1051199) { render = 'About 1 year ago'; } else {
          render = 'Over ' + Math.floor(minutes / 525960) + ' years ago';  
        }

        $(this).text(render);
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
        data.timer = setInterval(function() { self.relative('update'); data.options.onTick(); }, data.options.tick);
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