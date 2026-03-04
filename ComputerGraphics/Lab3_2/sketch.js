// --------- SERIAL SETUP (p5.serialport) ---------
let serial;
let portName = "COM9";   // <-- CHANGE THIS to your Arduino port (ex: "COM3", "COM7")

let latestData = "0,0";
let roll = 0;
let potValue = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // create serial object
  serial = new p5.SerialPort();

  // (optional) list ports in console
  serial.list();

  // connect to Arduino COM port
  serial.open(portName);

  // callback when a line comes in
  serial.on("data", gotData);

  textSize(18);
}

function gotData() {
  // read ONE line from serial
  let line = serial.readLine();

  // ignore empty lines
  if (!line) return;

  // remove newline
  latestData = line.trim();

  // split into 2 values: roll,pot
  let parts = latestData.split(",");
  if (parts.length === 2) {
    roll = float(parts[0]);
    potValue = int(parts[1]);
  }
}

function draw() {
  background(20);

  // --- map values ---
  // Your roll seems around ~80-90, so map that to rotation
let angle = map(roll, 0, 180, 0, TWO_PI);
  angle = constrain(angle, -PI / 2, PI / 2);

  // pot 0-1023 to bar height
  let barMaxH = 300;
  let barH = map(potValue, 0, 1023, 0, barMaxH);
  barH = constrain(barH, 0, barMaxH);

  // --- draw rotating angle line ---
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  stroke(0, 200, 255);
  strokeWeight(8);
  line(0, 0, 220, 0);
  pop();

  // --- draw pot bar ---
  let barX = width - 120;
  let barY = height / 2 - barMaxH / 2;
  let barW = 45;

  noStroke();
  fill(70);
  rect(barX, barY, barW, barMaxH, 10);

  fill(0, 255, 120);
  rect(barX, barY + (barMaxH - barH), barW, barH, 10);

  // --- labels + live numbers ---
  fill(255);
  textAlign(CENTER);
  text("Tilt Angle (MPU6050)", width / 2, 60);

  textAlign(LEFT);
  text("Potentiometer", barX - 40, barY + barMaxH + 35);

  textAlign(CENTER);
  text(`roll: ${nf(roll, 1, 2)}°`, width / 2, height / 2 + 180);
  text(`pot: ${potValue}`, barX + barW / 2, barY - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}