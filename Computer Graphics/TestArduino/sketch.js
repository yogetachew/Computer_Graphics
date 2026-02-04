let serial; // Serial communication object
let lightLevel = 0; // Value read from phototransistor
const numDots = 120; // Number of dots
let xPositions = [];
let yPositions = [];
let xSpeeds = [];
let ySpeeds = [];
let sizes = [];

function setup() {
  //createCanvas(1700, 800);
  createCanvas(windowWidth, windowHeight)
  background(0);
  
  // Initialize dot properties
  for (let i = 0; i < numDots; i++) {
    xPositions[i] = random(width);
    yPositions[i] = random(height);
    xSpeeds[i] = random(-0.5, 0.5);
    ySpeeds[i] = random(-0.5, 0.5);
    sizes[i] = random(10, 50);
  }
  

  // Initialize serial communication
  serial = new p5.SerialPort(this); // Use 'this' to bind the library
  serial.list(); // List available ports
  
  //serial.open('/dev/ttyUSB0'); // Adjust port as needed
  serial.open('COM12');
  

  serial.list((ports) => {
    console.log("Available ports:", ports);
  });
  
  // Callbacks
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
}

function draw() {
  background(0, 30);
  
  let maxSize = map(lightLevel, 0, 1023, 10, 100);
  let dotColor = map(lightLevel, 0, 1023, 50, 255);

  fill(dotColor, dotColor, 255, 150);
  noStroke();

  for (let i = 0; i < numDots; i++) {
    sizes[i] = lerp(sizes[i], maxSize, 0.05);
    xPositions[i] += xSpeeds[i];
    yPositions[i] += ySpeeds[i];

    if (xPositions[i] < 0 || xPositions[i] > width) xSpeeds[i] *= -1;
    if (yPositions[i] < 0 || yPositions[i] > height) ySpeeds[i] *= -1;

    ellipse(xPositions[i], yPositions[i], sizes[i], sizes[i]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function serialEvent() {
  let input = serial.readLine();
  if (input) {
    input = input.trim();
    lightLevel = parseInt(input);
  }
}

function serverConnected() {
  console.log('Connected to server.');
}

function portOpen() {
  console.log('The serial port is open.');
}

function serialError(err) {
  console.error('Serial port error: ' + err);
}

function portClose() {
  console.log('The serial port is closed.');
}
