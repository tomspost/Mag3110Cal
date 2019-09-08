// working code to go here!
var v = {};
    v.Vec3 = require('Vec3');
    v.vCal = new v.Vec3;
    v.raw = {};
    v.caled = {};
    v.heading = 0;
    v.rotation = 0;

  
v.cal = function (f) {
  // Calibrate the mag sensor or load a saved calibration.
  //////vMinMax = new Vec3;
   if (!f) {
     // check for stored cal
     var a = eval(require("Storage").read("cal"));
     if (a) {
       v.vCal.x = a.x; vCal.y = a.y; vCal.z = a.z;
       return;
     } 
   }
     // wait for a button press to stop
      console.log("done calibrating...UPDATED");
     
     // get raw mag value and find ranges
     
     // flash the LEDS
     
     // find the extreams 
     
     // adjust the ranges to find the mid point
     
     // save the clibration data to storage
  require("Storage").write("cal", v.vCal)
 console.log("new calibrating...");
  return;
};


v.ajust = function (doCal) {
  // calibrate the raw data
  // find the heading
  // find thge rotation
  console.log("UPDATED adjusted...");
return v.vCal;
};

exports = v;
