// sketch.js (serial skeleton used in all labs)
let serial; // the SerialPort object
let latestData = 0; // latest sensor value from Arduino (0–1023)
let latestData2 = 0; //for Exercise 4
let radius = 100;
let velocity = 0;
let targetRadius = 150;
let k = 0.05; // spring stiffness
let damping = 0.9;
function setup() {
createCanvas(windowWidth, windowHeight);
setupSerial(); // your existing serial init
}
function draw() {
background(20);
// Map pressure to target radius
// Higher pressure -> larger lung "capacity"
let sensorTarget = map(latestData, 0, 927, 80, 220);
sensorTarget = constrain(sensorTarget, 80, 220);
// Smooth target change a bit (avoid sudden jumps)
targetRadius = lerp(targetRadius, sensorTarget, 0.1);
// Spring physics
let displacement = targetRadius - radius;
let acceleration = k * displacement;
velocity += acceleration;
velocity *= damping;
radius += velocity;
// Draw "lungs"
noStroke();
fill(100, 200, 255);
circle(width / 2, height / 2, radius);
fill(255);
textSize(14);
text('Pressure (raw): ' + int(latestData), 20, 30);
text('Breathing Blob – Pressure Sensor', 20, 50);
}
function setupSerial() {
serial = new p5.SerialPort();
// List available ports in console
serial.list();
// TODO: replace with your port (e.g., 'COM3' on Windows, '/dev/ttyACM0' on Linux)
// You can also use p5.serialcontrol to pick the port.
serial.open('COM9');
serial.on('data', gotData);
}
function gotData() {
let currentString = serial.readLine();
if (!currentString) return;
currentString = currentString.trim();
if (!currentString) return;
let num = Number(currentString);
if (!isNaN(num)) {
latestData = num;
}
}
function windowResized() {
resizeCanvas(windowWidth, windowHeight);
}