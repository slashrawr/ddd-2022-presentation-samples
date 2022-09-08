let xoff;
let yoff;
let c = 5;
let max_iterations = 1000;
let m = 137.5;

function setup() {
  createCanvas(700, 700);
  angleMode(DEGREES);
  colorMode(HSB);
  xoff = width/2;
  yoff = height/2;
  noLoop();
}

function draw() {
  background(0);
  strokeWeight(2);
 
  for (let i = 0; i < max_iterations; i++) {
    let a = m * i;
    let rad = c*sqrt(i);
    let x = cos(a) * rad;
    let y = sin(a) * rad;
    stroke(a*0.3/255,a/255,a*0.75/255);
    point(x+xoff,y+yoff);
  }
}