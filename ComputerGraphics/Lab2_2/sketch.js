// Lab 2-2 – Live Graphing
// --------------------------------------------------------
// You already used p5.serialport in previous lab to read a single sensor value.
// In this lab, you will:
//
//  1. Draw a bar that shows the current sensor value (0–255).
//  2. Draw a simple history line graph of the last 100 values.
//
// Look for the "// TODO" comments and follow the instructions there.
 
// ---------- Serial globals ----------
let serial;          // the SerialPort object
let latestValue = 0; // most recent sensor value (0–255)
 
// ---------- Graph / data storage ----------
let history = [];        // array of recent values
const MAX_POINTS = 100;  // how many points we keep in history
 
// Min/max tracking
let minSeen = null;
let maxSeen = null;
 
// ----------------------------------------------------------
// p5 setup & draw
// ----------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
 
  // Create a new serial port object:
  serial = new p5.SerialPort();
 
  // List all available ports (see console for info)
  serial.list();
 
  // IMPORTANT: (Uncomment 1 - and add your info here)
  // serial.open("/dev/tty.usbmodemXXXX");  // Mac example
  serial.open("COM9");                  // Windows example
     
  // Register event callbacks:
  serial.on("connected", serverConnected);
  serial.on("list", gotList);
  serial.on("data", gotData);
  serial.on("error", gotError);
  serial.on("open", portOpen);
  serial.on("close", portClose);
 
  textFont("monospace");
}
 
function draw() {
  background(20);
 
  // Title
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Live", 10, 10);
 
  textSize(12);
  text("Current sensor value: " + latestValue, 10, 35);
 
  // Draw the bar for current value
  drawValueBar();
 
  // Draw the history graph
  drawHistoryGraph();
 
  // Draw min/max info at the bottom
  drawMinMax();
}
 
// ----------------------------------------------------------
// Serial event functions
// ----------------------------------------------------------
 
// Called when the server is connected
function serverConnected() {
  console.log("Connected to p5.serialserver");
}
 
// Called when we get the list of ports
function gotList(portList) {
  console.log("Serial port list:");
  for (let i = 0; i < portList.length; i++) {
    console.log(i + " " + portList[i]);
  }
}
 
// Called when the port is opened
function portOpen() {
  console.log("The serial port is open.");
}
 
// Called when new data is available
function gotData() {
  // Read a line of text until we reach a newline:
  let currentString = serial.readLine();
 
  if (!currentString) {
    return; // ignore empty strings
  }
 
  currentString = currentString.trim(); // remove whitespace
 
  // Convert to number
  let val = Number(currentString);
  if (isNaN(val)) {
    // If it's not a number, just ignore this line
    return;
  }
 
  // Clamp between 0 and 255:
  val = constrain(val, 0, 255);
 
  latestValue = val;
 
  // Update history
  addToHistory(val);
 
  // Update min/max
  updateMinMax(val);
}
 
// Called when there's an error on the serial port
function gotError(theError) {
  console.log("Serial error: " + theError);
}
 
// Called when the port is closed
function portClose() {
  console.log("The serial port is closed.");
}
 
// ----------------------------------------------------------
// Data helpers
// ----------------------------------------------------------
function addToHistory(val) {
  history.push(val);
  if (history.length > MAX_POINTS) {
    history.shift(); // remove oldest value
  }
}
 
function updateMinMax(val) {
  if (minSeen === null || val < minSeen) {
    minSeen = val;
  }
  if (maxSeen === null || val > maxSeen) {
    maxSeen = val;
  }
}
 
// ----------------------------------------------------------
// Drawing helpers
// ----------------------------------------------------------
 
// Draw a vertical bar showing the current sensor value.
function drawValueBar() {
  // Bar area
  const barX = 50;
  const barTop = 70;
  const barBottom = height - 70;
  const barWidth = 60;
 
  // Draw bar outline
  stroke(200);
  noFill();
  rect(barX, barTop, barWidth, barBottom - barTop);
 
  // TODO 1: Map the sensor value (0–255) to a bar height.
//  Hint:
//    - You want 0 to be at the bottom of the rectangle,
//      and 255 to be at the top.
//    - Use map(value, 0, 255, bottom, top) to get the Y coordinate
//      where the bar should reach.
//
//  Steps:
//    a) Compute a Y coordinate for the "filled" bar top using map().
//    b) Draw a filled rectangle from that Y down to barBottom.
  const barTopY = map(latestValue, 0, 255, barBottom, barTop);
  fill(255);
  rect(barX, barTopY, barWidth, barBottom - barTopY);

}
 
// Draw a simple line graph of the history array.
function drawHistoryGraph() {
  // Graph area
  const graphLeft = 150;
  const graphRight = width - 30;
  const graphTop = 70;
  const graphBottom = height - 70;
 
  // Draw frame
  stroke(200);
  noFill();
  rect(graphLeft, graphTop, graphRight - graphLeft, graphBottom - graphTop);
 
  // TODO 2: Draw tiny horizontal guides for 0, 128, and 255.
//  Hint:
//    - Use line() to draw a horizontal line across the graph area.
//    - Use text() to label 0 near the bottom, 128 in the middle,
//      and 255 near the top.
 const y0   = map(0,   0, 255, graphBottom, graphTop);
  const y128 = map(128, 0, 255, graphBottom, graphTop);
  const y255 = map(255, 0, 255, graphBottom, graphTop);

  stroke(80);
  line(graphLeft, y255, graphRight, y255);
  line(graphLeft, y128, graphRight, y128);
  line(graphLeft, y0,   graphRight, y0);

  noStroke();
  fill(180);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("255", graphLeft + 5, y255);
  text("128", graphLeft + 5, y128);
  text("0",   graphLeft + 5, y0);
 
  // TODO 3: Draw the history as a line graph.
//  Hint:
//    - history[i] is a value between 0 and 255.
//    - x should move from left → right across the graph.
//      A common pattern is: x = graphLeft + (i / (MAX_POINTS - 1)) * (graphRight - graphLeft)
//    - y is again a map of value from 0–255 to graphBottom–graphTop.
//
 stroke(0, 200, 255);
  noFill();
  beginShape();
  for (let i = 0; i < history.length; i++) {
    const x = graphLeft + (i / (MAX_POINTS - 1)) * (graphRight - graphLeft);
    const y = map(history[i], 0, 255, graphBottom, graphTop);
    vertex(x, y);
  }
  endShape();
}
 
// Draw min and max at the bottom of the canvas.
function drawMinMax() {
  fill(255);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
 
  const y = height - 40;
  const minStr = minSeen === null ? "--" : minSeen;
  const maxStr = maxSeen === null ? "--" : maxSeen;
  const msg = `Min: ${minStr}    Max: ${maxStr}`;
  text(msg, 10, y);
}
 
// Windows resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
