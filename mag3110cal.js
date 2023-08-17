var v = {};
    v.Vec3 = require('Vec3');
    v.running = false;

v.cal = function (f) {
  var vMin = new v.Vec3();
  var vMax = new v.Vec3();
  var sMax = 0;
  var sMin = 0;

  // check for and use stored values 
  if (!f) {
     var a = require("Storage").readJSON("cal", true);
     if (a) {
       v.zero = new v.Vec3(a.x, a.y, a.z);
       return;
     }
  }

  console.log("Rotate the puck in all directions \n until there are no red flashes \n then press button");
  v.running = true;
  Puck.magOn(10);
  var firstPass = true;

  Puck.on('mag', function(xyz) {
    if (!v.running) return;

    if (firstPass) {
      sMin = vMin.mag();
      firstPass = false;
    }

    vMin = vMin.min(xyz);
    vMax = vMax.max(xyz);

    if (vMax.mag() > sMax) {
      sMax = vMax.mag();
      digitalPulse(LED1,1,100);
    }

    else if (vMin.mag() < sMin) {
      sMin = vMin.mag();
      digitalPulse(LED1,1,100);
    }

    else {
      digitalPulse(LED2,1,50);
    }
  });

  // wait for a button press to stop Calibrating
  setWatch(function(e) {
    console.log("Calibration complete");
    v.zero = new v.Vec3((vMin.x + vMax.x)/2,(vMin.y + vMax.y)/2,(vMin.z + vMax.z)/2);
    require("Storage").write("cal", v.zero);
    require("Storage").write("calMinMax", {
      min: sMin,
      max: sMax
    });
    v.running = false;
  }, BTN, { repeat: false, edge: 'rising', debounce: 50 });
};

// Claibrate a raw mag value
v.adjust = function (vec) {
  console.log("v.zero ", v.zero);  
  v.aj = new v.Vec3(vec).sub(v.zero);
   // console.log("vec ", vec);
    //console.log("v.aj ", v.aj);
    v.h = (Math.atan2(v.aj.y, v.aj.x) * 180) / Math.PI;
      if (v.h > 360) {
      v.h = v.h - 360; 
    }
    if (v.h < 0) {
      v.h = v.h + 360;
    }
return v;
};

//exports = v;

var magCal = v;
    ///require("https://raw.githubusercontent.com/tomspost/Mag3110Cal/master/mag3110cal.js");

   // force re-calibration (false will use the last stored calibration if available)


Puck.magOn(1.25);

magCal.cal(true);
Puck.on('mag', function(m) {
    if (magCal.running) return;
    var mC = magCal.adjust (m); 
   console.log("heading ", mC.h);
    //console.log("rotation ", mC.r);
  },1);
