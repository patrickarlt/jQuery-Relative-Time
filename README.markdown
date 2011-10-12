# jQuery Time

Usage

`<time datetime="" data-relativize="FORMAT"></time>`

or

`$('time').relative(options);`

# Options

    {
      format: "String representing the origin "
      tick : how often to update the time 0 for no updates
    }

# Format Reference

Format is a string consisting of the following components...

%s  : Seconds
%ss : Seconds Padded
%m  : Minutes
%mm : Minutes Padded
%h  : Hours
%hh : Hours Padded
%d  : Days
%dd : Days Padded

%SECONDS : Second(s)
%MINUTES : Minute(s)
%HOURS   : Hour(s)
%DAYS    : Day(s)

or the string "human" for a human readable time