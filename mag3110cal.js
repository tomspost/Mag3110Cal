var v = {};
    v.Vec3 = require('Vec3');
    v.runing = false;

  
v.cal = function (f) {
  var vMin = new v.Vec3();
  var vMax = new v.Vec3();
  var sMax = 0; 
  var sMin = 0;
  
  // check for and use stored values 
  if (!f) {
     var a = eval(require("Storage").read("cal"));
     if (a) {
      // NED TP FIOX
       v.cal.x = a.x; cal.y = a.y; cal.z = a.z;
       return;
     } 
  }

  console.log("Rotate the puck in all directions \n until the are no red flashes \n then press button");
  v.runing = true;
  Puck.magOn(10);
  Puck.on('mag', function(xyz) {
    if (!v.runing) return;
    vMin = vMin.min(xyz);
    vMax = vMax.max(xyz);
    if ((sMax <  vMax.mag()) || (sMin > vMin.mag())) {
      if (!v.runing) return;
      sMin = vMin.mag();
      sMax = vMax.mag();
      digitalPulse(LED1,1,100);
    } else { 
      digitalPulse(LED2,1,50);
    }
  });
  
  // wait for a button press to stop Calibrating
  setWatch(function(e) {
    console.log("Calibrating completed");
    v.zero = new v.Vec3((vMin.x + vMax.x)/2,(vMin.y + vMax.y)/2,(vMin.z + vMax.z)/2);
    require("Storage").write("cal", v.zero);
    v.runing = false;
  }, BTN, { repeat: false, edge: 'rising', debounce: 50 });
};


// Claibrate a raw mag value
v.ajust = function (vec) {
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
    if (magCal.runing) return;
    var mC = magCal.ajust (m); 
   console.log("heading ", mC.h);
    //console.log("rotation ", mC.r);
  },1);
