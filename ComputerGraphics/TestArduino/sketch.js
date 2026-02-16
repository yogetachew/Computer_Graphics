let serial; // Serial communication object
let lightLevel = 0; // Value read from phototransistor
let serialTime = 0; // Time of the last serial read 

function setup() {
  //createCanvas(1700, 800);
  createCanvas(windowWidth, windowHeight)
  background(0);
  

  // Initialize serial communication
  serial = new p5.SerialPort(this); // Use 'this' to bind the library  
  serial.open('COM9');
  
  // Callbacks
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
}

function draw() {
  background(0, 30);
  
  // orange warning if the port is disconnected
  if (lightLevel === 0) {
    fill(255, 100, 0); 
    textAlign(CENTER, CENTER);
    textSize(28);
    text("Serial port might be disconnected", width / 2, height / 2);
    return; // stop drawing anything else
  }

  let size = map(lightLevel, 0, 1023, 20, 400);
  // when the light is above 312 it will show the star.
  let isBright = lightLevel > 412;
  
  noStroke();

  if (isBright) {
    // bright yellow start to show bright day light
    fill(255,215,0,200);
    makeStar(width / 2, height / 2, size * 0.4, size * 0.9, 5);
  } else {
    // it will be white circle to make it look like the moon when it's dark
    fill(220,220,255,180);
    ellipse(width / 2, height / 2, size, size);
  }
  }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function makeStar(x, y, radius1, radius2, points) {
  // Draw a star shape at (x, y) with given inner and outer radii and number of points
  // push will save the current drawing, translate will move the origin to (x, y), and pop will restore everything back
  // beginShape and endShape will create a custom shape based on the vertices defined in between
  push();
  translate(x, y);
  beginShape();
  for (let i = 0; i < points * 2; i++) {
    let angle = PI * i / points;
    let r = (i % 2 === 0) ? radius1 : radius2;
    vertex(r * cos(angle), r * sin(angle));
  }
  endShape(CLOSE);
  pop();
}

function serialEvent() {
  let input = serial.readLine();
  if (input) {
    input = input.trim();
    lightLevel = parseInt(input);
   if (!isNaN(lightLevel)) {        
    serialTime = millis(); // Update the time of the last serial read
  }
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
