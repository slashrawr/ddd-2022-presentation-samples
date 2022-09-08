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
 
  for (let i = 0; i < max_iterations; i++) {
    let a = m * i;
    let tmp = c*sqrt(i)+i*1;
    let x = cos(a) * tmp;
    let y = sin(a) * tmp;
    strokeWeight(i);
    stroke(a*0.5/255,a/255,a*0.35/255);
    point(x+xoff,y+yoff);
  }
}