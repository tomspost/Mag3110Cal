var Vec3 = require('Vec3');
var vMin = new Vec3();
var vMax = new Vec3();
var vAve = new Vec3();
var vZero = new Vec3();
var calibrating = false;
var calibrated = false;
var count = 0;
var h = 0;
var oldh = 0;
var r = 0;
var controls = require("ble_hid_controls");
var nrf = NRF.setServices(undefined, { hid : controls.report });
/*
// use this for power managment
// call a function if button is held down for 4 seconds
function b4Seconds(callback) {
  setWatch(function(e) {
    if (calibrating) {return;}
    console.log("Button down");
    t4s = setTimeout(function() {
      callback();
    },4000);
    setWatch(function(e) {
      clearTimeout(t4s);
      console.log("Button up");
    }, BTN, { repeat: false, edge: 'falling', debounce: 50 });
  }, BTN, { repeat: true, edge: 'rising', debounce: 50 });
}
*/
function calibrate () {
  if (calibrated) {
    //console.log('re-calibrating...');
  } else {
    //console.log('calibrating...');
  }
  calibrated = false;
  calibrating = true;
  var xyz = Puck.mag();
  var sMax = 0;
  var sMin = 0;
  count = 0;
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
      count++;
      //console.log('new min or max: ',count);
      // flash the red LED when calibrating
      digitalPulse(LED1,1,100);
    } else {
    // flash the green LED when not calibrating
    digitalPulse(LED2,1,10);
    }
  });
  //press the buton to stop calibrating
  setWatch(function(e) {
    Puck.magOn(5);
    calibrating = false;
    //console.log("calibarion completed");
    //console.log('max: ',vMax);
    //console.log('min: ',vMin);
    // calculate the average of vMin and vMax to get the nuteral position
    vAve = new Vec3((vMin.x + vMax.x)/2,(vMin.y + vMax.y)/2,(vMin.z + vMax.z)/2);
   // console.log('ave: ',vAve);
    // get the zero position when the end calibrate button was pressed
    vZero = new Vec3(Puck.mag()).sub(vAve);
   // console.log('zero:',vZero);
    calibrated = true;
  }, BTN, { repeat: false, edge: 'rising', debounce: 50 });
}
function calibratedMag() {
  var comQueue = [];
  var coms = false;
  // use the button for play/pause
  setWatch(function(e) {
    if(calibrating) {return;}
    comQueue.push('S');
    digitalPulse(LED1,1,10);
    digitalPulse(LED2,1,10);
    digitalPulse(LED3,1,10);
  }, BTN, { repeat: true, edge: 'rising', debounce: 50 });
  Puck.magOn(10);
  Puck.on('mag', function(xyz) {
    if(calibrating) {return;}
    if ((comQueue.length > 0) && (coms == false)){
      coms = true;
      //console.log(comQueue,coms);
      var comand = comQueue.pop();
      if (comand == 'U') {
        digitalPulse(LED1,1,3);
        try {
          controls.volumeUp(function(){
            controls.volumeUp(function(){
              coms = false;
            });});
        } catch (e) {coms = false;}
      }
      if (comand == 'D') {
        digitalPulse(LED3,1,3);
        try {
          controls.volumeDown(function(){
            controls.volumeDown(function(){
              coms = false;
            });});
        } catch (e) {coms = false;}
      }
      if (comand == 'N') {
        digitalPulse(LED2,1,3);
        try {
          controls.next(function(){
              coms = false;
          });
        } catch (e) {coms = false;}
      }
      if (comand == 'P') {
        digitalPulse(LED2,1,3);
        try {
          controls.prev(function(){
              coms = false;
          });
        } catch (e) {coms = false;}
      }
      if (comand == 'S') {
        try {
          controls.playpause(function(){
              coms = false;
          });
        } catch (e) {coms = false;}
      }
    }
    // correct mag reading using calibration data
    var vMag = new Vec3(xyz).sub(vAve);
    //console.log('mag: ',vMag);
    h = (Math.atan2(vMag.y, vMag.x) * 180) / Math.PI;
    if (h > 360) {
      h = h - 360;
    }
    if (h < 0) {
      h = h + 360;
    }

    r = Math.round(h - oldh);
    if ((r > 300)) {r = r - 360;}
    if ((r < -300)) {r = r + 360;}

    if (Math.abs(r) >4) {
      if (vMag.z > 0) {
        if (r>0) {
          comQueue.push('U');
          //try { controls.volumeUp();} catch (e) { }
        } else {
          comQueue.push('D');
        }
      } else {
        if (r>0) {
          comQueue.push('P');
        } else {
          comQueue.push('N');
        }
      }
      //console.log('-------------');
      if (!calibrated) {console.log('uncalibrated!');}
        //console.log('heading: ',Math.round(h));
        //console.log('rotate: ',r);
      if (vMag.z > 0) {
        //console.log('upwards');
      } else {
        //console.log('downwards');
      }
    }
    oldh = h;
  });
}
//calibrate by holding button down for 4 seconds
calibrate()
calibratedMag();
