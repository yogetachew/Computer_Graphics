//constant variables 
// this will start it with a blank screen and you have to press 1,2,3, or 4 
// on your keyboard to see each mode
let mode = 0;
let x = 200;
let y = 200;
let xspeed = 3;
let yspeed = 2;
let cellSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
}
  background(220);


function draw() {
  if (mode === 1){
  // get map values for r, g, b based on mouse position
  // red increases left to right, green increases top to bottom, blue decreases top to bottom
  let r = map(mouseX, 0, width, 0, 255);
  let g =map(mouseY, 0, height, 0, 255);
  let b = map(mouseY, 0, height, 255, 0);
  background(r, g, b);
  
} else if (mode === 2){
  background(220);
  // moving cirle
  circle(x, y, 20);
  x = x + xspeed;
  y = y + yspeed;

  // bounce off edges on all sides
  if (x > width - 10 || x < 10){
    xspeed = xspeed * -1;
  }
  if (y > height - 10 || y < 10){
    yspeed = yspeed * -1;
  }

} else if (mode === 3){
  if (mouseIsPressed){
    let size = map(mouseY, 0, height, 10, 100);

    // choose random fill color
    let r = random(255);
    let g = random(255);
    let b = random(255);
    fill(r, g, b);
    // i got lots of error just by typing noStroke like (nostroke)
    noStroke();

    if (random(1) < 0.5){
      circle(mouseX, mouseY, size);
    } else {
      square(mouseX, mouseY, size);
    } 
 }
} else if (mode === 4){
  for (let x = 0 ; x < width; x += cellSize){
    for (let y = 0; y < height; y += cellSize){

      // choose random fill color
      fill(random(255), random(255), random(255));
      noStroke();

      circle(x + cellSize / 4, y + cellSize / 4, cellSize - 10);
    }
  }
  // draw pattern only once
  noLoop(); 
}
}
// switch modes with number keys so instead of displaying the options
// just press the number keys 1, 2, 3, or 4 to change modes
// it starts with mode 0 (blank screen)
function keyPressed(){
  if (key === '1'){
    mode = 1;
    // restart loop
    loop(); 
  } else if (key === '2'){
    mode = 2;
    // restart loop
    loop(); 
  } else if (key === '3'){
    mode = 3;
    // restart loop
    loop(); 
    background(220); 
  } else if (key === '4'){
    mode = 4;
    // restart loop
    loop(); 
    // clear canvas when switching to mode 4
    background(220); 
  }
  }