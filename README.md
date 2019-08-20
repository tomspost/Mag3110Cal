## Mag3110Cal
Calibrate and use the MAG3110 Magnetometer on the PuckJS IOT beacon

## What is the PuckJS
PuckJs is a cool programiable bluetooth LE v5 beacon. It is programmed in Javascript via a web based IDE. It has a button, 3 LEDs, a mag sensor, a light sensor, a programmible NFC card, and an IR transmitter. PuckJSs can connect to each other and othe bluetooth devices.

 [http://www.espruino.com/Puck.js](http://www.espruino.com/Puck.js)
 
## How Mag3110Cal works
The reading from the uncalibrate mag sensor are not zero based and can't be used to mesure rotation of the puck. To calibrate I find and store the highest and lowest axis readings while rotating the puck in all directions. I then caluclate the mid point between these for each axes. I then provide a method that when passes an uncalibrated reading returns a calibrated reading with the additon of a compass heading and the rotation since the last calibration with a correction for crossing 0 and 360.  Calibrate the puck away from metal and strong magnets.
