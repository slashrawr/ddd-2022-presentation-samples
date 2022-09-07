let shift = 0;
let scaler = 1.1;
let offset = {};

function setup() {
  createCanvas(700, 700);
  frameRate(20);
  background(220);
  noFill();
  stroke(0,0,0,50);
  offset = new p5.Vector(100,100);
  noiseDetail(6,0.05);
}

function draw() {
  
  let x1 = (width * noise(shift + 10));
  let x2 = (width * noise(shift + 20));
  let x3 = (width * noise(shift + 30));
  let x4 = (width * noise(shift + 40));
  let y1 = (height * noise(shift + 50));
  let y2 = (height * noise(shift + 60));
  let y3 = (height * noise(shift + 70));
  let y4 = (height * noise(shift + 80));
  
  shift += 0.011;
  
  bezier(x1*scaler+offset.x, y1*scaler+offset.y, x2*scaler+offset.x, y2*scaler+offset.y, x3*scaler+offset.x, y3*scaler+offset.y, x4*scaler+offset.x, y4*scaler+offset.y);
  
  x1 = x4;
  x2 = width * noise(shift + 20);
  x3 = width * noise(shift + 30);
  x4 = width * noise(shift + 40);
  y1 = y4;
  y2 = height * noise(shift + 60);
  y3 = height * noise(shift + 70);
  y4 = height * noise(shift + 80);
  
  bezier(x1*scaler+offset.x, y1*scaler+offset.y, x2*scaler+offset.x, y2*scaler+offset.y, x3*scaler+offset.x, y3*scaler+offset.y, x4*scaler+offset.x, y4*scaler+offset.y);
  
  if (frameCount >= 1000)
    noLoop();
}