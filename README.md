## Mag3110Cal
Calibrate and use the MAG3110 Magnetometer on the PuckJS IOT beacon

## What is the PuckJS
PuckJs is a cool programmable bluetooth LE v5 beacon. It is programmed in Javascript via a web based IDE. It has a button, 3 LEDs, a mag sensor, a light sensor, a programmable NFC card, and an IR transmitter. PuckJSs can connect to each other and other bluetooth devices.

 [http://www.espruino.com/Puck.js](http://www.espruino.com/Puck.js)

[Media controller example]{...}
 
## How Mag3110Cal works
The reading from the uncalibrated mag sensor are not zero based and can't be used to calculate rotation of the puck. To calibrate I find and store the highest and lowest axis readings while rotating the puck in all directions. I then calculate the mid point between these for each axes. I then provide a method that when passes an uncalibrated reading returns a calibrated reading with the addition of a compass heading and the rotation since the last calibration with a correction for crossing 0 and 360.  Calibrate the puck away from metal and strong magnets.

During calibration the puck will flash red and green. Just rotate the puck in all directions until you only see green flashes. Then press the button to end calibration.
```javascript
magCal = require("...");

   // force re-calibration (false will use the last stored calibration if available)
MagCal.cal(true);

puck.magOn();

puck.MagRead( function (m) {
    var mC = magCal(m);
    console.log("calibrated mag readings ", mC.x, mC.y, mC.z);
    console.log("heading ", mC.h);
    console.log("rotation ", mC.r)
  },5);
```
