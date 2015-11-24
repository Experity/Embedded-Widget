# Clockwise.MD Website Widget

This first snippet of code is what gets the wait time from your clinic.  It should go inside the `<head>` tag of your web page.  You want to replace __[ID]__ with your hospital's id number (exclude the brackets)

```javascript

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="http://clockwisemd.com/hospitals/clockwise_api.js">
</script>

<script>
  jQuery(document).ready( function() {
    jQuery('body').on('clockwise_waits_loaded', function (e, id) {
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
This next snippet of code will render a button on your webpage that a potential patient can click to follow to the online appointment creation screen.  This can be placed anywhere within the `<body>` tag on your web page.

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

    <!-- TODO replace [ID] with your hosptial's id (exclude the brackets) -->
    <a href="https://clockwisemd.com/hospitals/[ID]/appointments/new" style="color:white;
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

If you do not want the above styling, the minimum `HTML` code needed to display your wait time is the following.

```html

<!-- TODO replace [ID] with your hosptial's id (exclude the brackets) -->
<h4>Current wait-time:<div id="current_wait_[ID]" style="display:inline;"></div>

```
