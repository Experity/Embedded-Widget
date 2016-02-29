# Clockwise.MD Website Widget
### A Quick Note
This is a patient facing widget that is meant to be added to your clinic or hospital's public
facing website.  It does not in any way affect functionality of the application.

---
### Demonstration
[Click here to see the widget in action](http://lightshedhealth.github.io/Website-Widget-API/)

---
### Beginner's Guide
This first snippet of code is what gets the wait time from your clinic.  It should go inside the
`<head>` tag of your web page.  You want to replace __[ID]__ with your hospital's id number
(exclude the brackets) where noted.

```javascript

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="https://www.clockwisemd.com/hospitals/clockwise_api.js"></script>

<script>
  jQuery(document).ready( function() {
    jQuery('body').on('clockwise_waits_loaded', function (e, id) {
      // MAKE SURE NOT TO CHANGE THE ID HERE
      jQuery('#current_wait_'+id).html(Clockwise.Waits[id]);
    });
    loadAllWaits();
  });

  function loadAllWaits() {
    /*
     * TODO change [ID] to your hospital's id
     */
    Clockwise.CurrentWait([ID], 'html');  

    // To Add additional wait times for other clinics, copy line above with different ID.
    setTimeout(function(){loadAllWaits()},60000);
  }
</script>

<style>
  .clockwise_current_wait{display:inline;}
</style>

```
---
This next snippet of code will render a button on your webpage that a potential patient can click
to follow to the online appointment creation screen.  This can be placed anywhere within the
`<body>` tag on your web page.

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

      <!-- TODO replace [ID] with your hospital's id (exlude the brackets) -->
      <div id="current_wait_[ID]" style="display:inline;"></div> Minutes</h3>

    <!-- TODO replace [ID] with your hospital's id (exclude the brackets) -->
    <a href="https://www.clockwisemd.com/hospitals/[ID]/appointments/new" style="color:white;
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

The above snippet is pre-styled.  It will look as follows:

![Default Widget](Default_Widget_Style.png)

If you do not want the above styling, the minimum `HTML` code needed to display your wait time
is the following.

```html

<!-- TODO replace [ID] with your Hospital's id (exclude the brackets) -->
<h4>Current wait time:<div id="current_wait_[ID]" style="display:inline;"></div></h4>

```

### Display a Range
If you'd like to display a time range instead of just a number, it's fairly easy to extend
our API to do this.  We'll be editing the Javascript used in the `<head>` tag as follows:

```javascript

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="https://www.clockwisemd.com/hospitals/clockwise_api.js"></script>

<script>
  jQuery(document).ready( function() {
    jQuery('body').on('clockwise_waits_loaded', function (e, id) {
      // REMEMBER: do NOT put your hospital's id in this function

      // This is the raw wait time that we'll be using
      var current_wait = parseInt(jQuery(Clockwise.Waits[id]).html());
      // TODO change this to equal your desired wait time (in minutes)
      var predicted_wait_range = 15;

      // This creates our new container to insert into the page.  You can edit this to look however
      // you want.  This example is the one displayed in the demonstration page linked above
      var waits_div = "<div class='clockwise_current_wait'>" + current_wait +
        " - " + (current_wait + predicted_wait_range) + "</div>";

      // Finally, this will add it to your web page
      jQuery('#current_wait_'+id).html(waits_div);
    });
    loadAllWaits();
  });

  function loadAllWaits() {
    /*
     * TODO change [ID] to your hospital's id
     */
    Clockwise.CurrentWait([ID], 'html');  

    // To Add additional wait times for other clinics, copy line above with different ID.
    setTimeout(function(){loadAllWaits()},60000);
  }
</script>

<style>
  .clockwise_current_wait{display:inline;}
</style>

```

With this in place, we won't need to alter anything in our `<body>` tag of the web page.

### Advanced Topics
For systems with multiple clinics, the Clockwise widget can easily scale to allow for retrieval
of all your wait times.  Understanding how the code functions can be helpful to properly setting
up your web page.

First, we'll analyze the javascript.  The following two lines import jQuery, a popular javascript
library, and the Clockwise API, respectively.  

```javascript

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="https://www.clockwisemd.com/hospitals/clockwise_api.js"></script>

```

Your website should only import jQuery once, so if it already
exists somewhere, don't add it again (but make sure that the version is 1.10.2 or greater).  
The Clockwise API provides the functions to query your clinic. Below is the next part of the
javascript that sets up the call.  It must come __AFTER__ you've called the above scripts.

```javascript

jQuery(document).ready( function() {
  jQuery('body').on('clockwise_waits_loaded', function (e, id) {
    jQuery('#current_wait_'+id).html(Clockwise.Waits[id]);
  });
  loadAllWaits();
});

```

The outer function, `jQuery(document).ready( function() { ... } )`, tells jQuery to run the
function within it once the page has loaded.  
The next part, called inside of the `ready` function, is
`jQuery('body').on('clockwise_waits_loaded', ... )`, which tells the page to listen for the
`clockwise_waits_loaded` signal that the Clockwise API sends when it has loaded the waits and once
it receives that signal, to run a different function.  Next, `function(e, id) { ... }` is the
function called when the signal is received.  Notice the inputs `e` and `id`.  The `e` is short
for `event`, which can safely be ignored, but must still be included.  The second input, `id`, is
the variable that will hold your hospital's id.  Finally, the piece that assigns the wait to
the corresponding __HTML__ tag is `jQuery('#current_wait_'+id).html(Clockwise.Waits[id]);`, which
accomplishes a couple things.  1) It creates a unique identifier for the current wait, as can
be seen by `'#current_wait_'+id` (so if you have a hospital with id 293, it will easily be
identifiable).  2) It assigns the value of the current wait for the retrieved id.  The last
thing called within the `ready` function is `loadAllWaits()`, which will be described below.

```javascript

function loadAllWaits() {
  /*
   * TODO change [ID] to your hospital's id
   */
  Clockwise.CurrentWait([ID], 'html');  

  // To Add additional wait times for other clinics, copy line above with different ID.
  setTimeout(function(){loadAllWaits()},60000);
}

```

The `loadAllWaits()` function does two important things.  First, it calls
`Clockwise.CurrentWait( ... )` on the supplied hospital id, and then it sets up the function to
be called again in 1 minute.  This allows your web page to stay live in its updates without
having to refresh the page.  If you wanted to call for multiple hospital ids, your `loadAllWaits()`
function might look like this:

```javascript

function loadAllWaits() {
  Clockwise.CurrentWait(1, 'html');
  Clockwise.CurrentWait(8, 'html');
  Clockwise.CurrentWait(293, 'html');

  // To Add additional wait times for other clinics, copy line above with different ID.
  setTimeout(function(){loadAllWaits()},60000);
}

```
Make sure the hospital ids you include correspond to the hospitals in your network, otherwise
you'll be getting wait times from different clinics!


The last important piece to discuss is the __HTML__ you'll include in the `<body>` tag of your
page.  The much longer one is our pre-styled widget, but most of the styling is non-essential, so
I will instead just strip out the important part.

```html

<h4>Current wait time:<div id="current_wait_[ID]" style="display:inline;"></div></h4>

```

The important part is
`<h4>Current wait time:<div id="current_wait_[ID]" style="display:inline;"></div></h4>` because
that is where the wait time will go.  Again, this is one of the places where you need  to input
your id number, so a complete example is as follows:

```html

<h4>Current wait time:<div id="current_wait_293" style="display:inline;"></div></h4>

```
