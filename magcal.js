var Vec3 = require('Vec3');
var vMin = new Vec3();
var vMax = new Vec3();
var vAve = new Vec3();
var calibrating = false;
var calibrated = false;
var h = 0;
var oldh = 0;
var r = 0;

function calibrate () {
  calibrated = false;
  calibrating = true;
  var xyz = Puck.mag();
  var sMax = 0;
  var sMin = 0;
  vMin = new Vec3(xyz);
  vMax = new Vec3(xyz);
  Puck.magOn(10);
  Puck.on('mag', function(xyz) {
    if (calibrated) {return;}
    var vMag = new Vec3(xyz);
    vMin = vMin.min(vMag);
    vMax = vMax.max(vMag);
    if ((sMax !=  vMax.mag()) || (sMin != vMin.mag())) {
      sMin = vMin.mag();
      sMax = vMax.mag();
      // flash the red LED when new min or max found;
      digitalPulse(LED1,1,100);
    } else {
    // flash the green LED when nothing new
    digitalPulse(LED2,1,10);
    }
  });
  //press the buton to stop calibrating
  setWatch(function(e) {
    Puck.magOn(5);
    calibrating = false;
    // calculate the average of vMin and vMax to get the nuteral position
    vAve = new Vec3((vMin.x + vMax.x)/2,(vMin.y + vMax.y)/2,(vMin.z + vMax.z)/2);
    // get the zero position when the end calibrate button was pressed
    calibrated = true;
  }, BTN, { repeat: false, edge: 'rising', debounce: 50 });
}


function fixCal(xyz,fixed) {
  if (!calibrated) {return;}
  if (!fixed) var fixed = {};
  var vMag = new Vec3(xyz).sub(vAve);
  fixed.h = (Math.atan2(vMag.y, vMag.x) * 180) / Math.PI;
  if (fixed.h > 360) {fixed.h = fixed.h - 360;}
  if (fixed.h < 0) {fixed.h = fixed.h + 360;}
  fixed.r = Math.round(fixed.h - oldh);
  if ((fixed.r > 300)) {fixed.r = fixed.r - 360;}
  if ((fixed.r < -300)) {fixed.r = fixed.r + 360;}
  if (vMag.z > 0) {
        fixed.ud = "up";
  } else {
        fixed.ud = "down";
  }
  oldh = fixed.h;
  return fixed;
}


function demo() {
  var fixed = {};
  Puck.magOn(10);
  Puck.on('mag', function(xyz) {
    if (!calibrated) {return;}
    fixCal(xyz,fixed);
    console.log('heading: ',Math.round(fixed.h));
    console.log('rotate: ',fixed.r);
    console.log('u/d: ',fixed.ud);

  });
}

//calibrate by holding button down for 4 seconds
calibrate();
demo();
