# Clockwise.MD Embedded Widget

### Usage Note

This is a patient facing widget that is meant to be added to your clinic or hospital's public
facing website. It does not in any way affect functionality of the application.

### Demonstration

[Click here to see the widget in action](https://examples.clockwisemd.com/Embedded-Widget/)

### Basic Usage

The following is a basic example of fetching just the hospital wait time for a
clinic with ID 293.

```html
<html>
  <head>
    <!-- Content in your head -->
    <!-- ... -->
    <script
        src="https://code.jquery.com/jquery-3.2.1.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
    <script src="https://s3-us-west-1.amazonaws.com/clockwisepublic/clockwiseWaitTimes.min.js"></script>
  </head>
  <body>
    <!-- Content in your body -->

    <!-- ... -->

    <h3><div id='current-wait-293'></div> Minutes</h3>

    <!-- ... -->

    <script type='application/javascript'>
      var WAIT_FETCH_OBJECTS = [
          { hospitalId: 293,
            timeType:   'hospitalWait',
            selector:   '#current-wait-293' }
      ];
      beginWaitTimeQuerying(WAIT_FETCH_OBJECTS);
    </script>
  </body>
</html>
```

To see what your clinic's time would be, replace all instances of 293
above with your clinic's ID instead.  If you would like to use our pre-styled
widget, replace
```html
<h3><div id='current-wait-293'></div> Minutes</h3>
```
with
```html
<div style="display: inline-block; padding: 12px 20px 20px; margin-bottom: 0;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px;
  line-height: 20px; color: #ffffff; text-align: center; background-color:#2a7bbb;
  cursor: default; -webkit-border-radius: 14px; -moz-border-radius: 14px;
  border-radius: 14px; width:300px;">
  <div style="font-size:36px; line-height:40px; display:inline; font-weight:bold;
  letter-spacing:2px;">Skip </div>
  <div style="font-size:30px; line-height:40px; display:inline; font-weight:100;
  letter-spacing:2px; font-style:italic;">the </div>
  <div style="font-size:36px; line-height:40px; display:inline; font-weight:bold;
  letter-spacing:2px;">Wait</div>
  <h3 style="font-size:18px; line-height:20px; font-weight:300; margin-top:0px;
  margin-bottom:10px; display: block;">Current Wait is:
    <div id="current-wait-293" style="display:inline;"></div> Minutes</h3>
  <a href="https://www.clockwisemd.com/hospitals/293/appointments/new" style="color:white;
  text-decoration: none; font-size: 26px; line-height:30px; font-weight:bold;
  letter-spacing:2px; margin-top:15px; padding: 5px 10px; margin-bottom: 0;
  text-align: center; cursor: pointer;
  background-image: -moz-linear-gradient(top, #FF6600, #FF0000);
  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#FF6600), to(#FF0000));
  background-image: -webkit-linear-gradient(top, #FF6600, #FF0000);
  background-image: -o-linear-gradient(top, #FF6600, #FF0000);
  background-image: linear-gradient(to bottom, #FF6600, #FF0000);
  background-repeat: repeat-x; border: 1px solid #FF6600;
  -webkit-border-radius: 10px; -moz-border-radius: 10px;
  border-radius: 10px;">Reserve my spot</a>
</div>
```

The above snippet is pre-styled. It will look as follows:

![Default Widget](Default_Widget_Style.png)


It is important that the string passed to the `selector` matches the location
of where you want to populate wait times.  If you are using the pre-styled
widget, make sure you change the link for `Reserve my spot` so that it points
to the desired clinic.

### Multiple Hospitals and Queue Usage

In some cases it may be necessary to show wait times for multiple hospitals, or
to show wait times on the appointment queue level.  You may even wish to show
patients in line.  In this case, we can use multiple wait fetching objects.
Below is an example that shows a hospital's wait time, a different hospital's
wait time, and a wait time from one of the appointment queues at the first
hospital.

```html
<html>
  <head>
    <!-- Content in your head -->
    <!-- ... -->
    <script
        src="https://code.jquery.com/jquery-3.2.1.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
    <script src="https://s3-us-west-1.amazonaws.com/clockwisepublic/clockwiseWaitTimes.min.js"></script>
  </head>
  <body>
    <!-- Content in your body -->

    <!-- ... -->

    <h3><div id='current-wait-293'></div> Minutes</h3>
    <h3><div id='current-wait-294'></div> Patients In Line</h3>
    <h3><div id='current-queue-wait-458'></div> Minutes to wait in Queue</h3>

    <!-- ... -->

    <script type='application/javascript'>
      var WAIT_FETCH_OBJECTS = [
          { hospitalId: 293,
            timeType:   'hospitalWait',
            selector:   '#current-wait-293' },
          { hospitalId: 294,
            timeType:   'hospitalPatientsInLine',
            selector:   '#current-wait-294' },
          { hospitalId: 293,
            queueId:    458,
            timeType:   'queueWait',
            selector:   '#current-queue-wait-458' },
      ];
      beginWaitTimeQuerying(WAIT_FETCH_OBJECTS);
    </script>
  </body>
</html>
```

If we take a look at the `WAIT_FETCH_OBJECTS` array, we are now passing new `timeTypes`.
There are a total of six possible `timeTypes` to choose from.

```javascript
'hospitalWait'           // Returns the Hospital's current wait in minutes
'hospitalPatientsInLine' // Returns the Hospital's current patients in line
'hospitalTotalPatients'  // Returns the total number of patients at the hospital (includes appointments later in the day)
'queueWait'              // Returns a Queue's current wait in minutes (this requires the the queueId to be passed)
'queuePatientsInLine'    // Returns a Queue's current patients in line (this requires the the queueId to be passed)
'queueWaitRange'         // Returns a Queue's current wait in minutes in the form of a range (this requires the the queueId to be passed)
```

### Formatting and Custom Response Handling

In some cases, you may wish to apply additional logic to a value, for example
to display a custom message when the clinic is closed or to express the wait
time as a range different from how you would show it on a Clockwise page.  In
order to accomplish this, you can define a custom callback function, which will
receive the value exactly as it is returned from the Clockwise API and should
return the content that you wish to inject into the specified element on the
page.

Below is an example that displays a custom message any time the Clockwise API
returns `"Closed"`. Otherwise, it displays the current wait as a 10-minute
range.

```
<html>
  <head>
    <!-- Content in your head -->
    <!-- ... -->
    <script
        src="https://code.jquery.com/jquery-3.2.1.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
    <script src="https://s3-us-west-1.amazonaws.com/clockwisepublic/clockwiseWaitTimes.min.js"></script>
  </head>
  <body>
    <!-- Content in your body -->

    <!-- ... -->

    <h3><div id='current-wait-293'></div></h3>

    <!-- ... -->

    <script type='application/javascript'>
      function waitTimeMessage(rawWait){
        if (rawWait === 'Closed') { return 'The clinic is currently closed.  You can still reserve a time for tomorrow' };
        var numericWait = parseInt(rawWait);
        var waitRangeEnd = numericWait + 10;
        return 'Next available visit is in ' + numericWait + ' - ' + waitRangeEnd + ' minutes';
      };

      var WAIT_FETCH_OBJECTS = [
          { hospitalId:     293,
            timeType:       'hospitalWait',
            selector:       '#current-wait-293',
            formatFunction: waitTimeMessage }
      ];
      beginWaitTimeQuerying(WAIT_FETCH_OBJECTS);
    </script>
  </body>
</html>
```

Note that the full output of the formatting message will replace the full
content of the associated page element, so use cases involving a callback
function will generally require that the associated selector covers a wider
scope than those where the returned number or range is injected directly.

### Advanced

This widget acts as a WYSIWYG drop in for immediately showing wait times.  For a deeper
understanding of how we pull wait times out, read through the comments in
`clockwiseWaitTime.js`.  If you find that what you need is not covered within
the wait API, check out our [documentation page](https://www.clockwisemd.com/docs).
You will need to be an authenticated user to view this page.

### Old documentation

Looking for our old documentation?  [Follow this link!](https://github.com/LightshedHealth/Embedded-Widget/tree/e3b91834b2fa1bd56b68704462ca3fde616b78c1)

### Show information for a lot of clinics

If you need something that is more tuned toward showing wait times at many facilities, [follow this link to look into our groups widget!](https://github.com/LightshedHealth/Embedded-Map)
