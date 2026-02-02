function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  
  let r = map(mouseX, 0, width, 0, 255);
  let g =map(mouseY, 0, height, 0, 255);
  let b = map(mouseY, 0, height, 255, 0);

  background(r, g, b);
  
}
function windowsResized(){
 resizeCanvas(windowWidth, windowHeight)
}