let showAxis = false;
let seed = 2124125;
let numberOfCircles = 6;
let radiusScale = 15;
let width = 1000;
let height = 500;
let vectorMultiplier = 5;
let minY;
let maxY;
let minX;
let maxX;

function setup() {
  createCanvas(width, height, WEBGL);
  noLoop();
  blendMode(ADD);
  
  minY = -height/2;
  maxY = height/2;
  minX = -width/2;
  maxX = width/2;
}

function draw() {
  colorMode(RGB, 255);
  smooth(8);
  background(0, 0, 0);
  scale(1,-1); //flip the Y axis
  angleMode(DEGREES);
  randomSeed(seed);
  
  if (showAxis)
  {
    line(0, minY, 0, maxY);
    line(minX, 0, maxX, 0);
  }
  
  let v1 = createVector(random(minX, maxX), random(minY, maxY));
  v1.setHeading(0);
  
  for (c = 1; c <= numberOfCircles; c++)
  {
    let col = color(random(0,255), random(0,255), random(0,255), 10);
    stroke(col);
    strokeWeight(1);
    
    let angle = random(2 * PI);
    v1.setHeading(angle);
    let dist = random(50);
    let newVector = v1.copy();
    newVector.add(100);
    
    v1.setHeading(0);
    
    for (i = 1; i <= 800; i++)
    {
      let rndang = random(360);
      tx = newVector.x + (radiusScale*c) * cos(rndang);
      ty = newVector.y + (radiusScale*c) * sin(rndang);
      tm = -(1/((ty-newVector.y)/(tx-newVector.x))); //tangent slope

      let tangentVector = createVector(tx, ty);
      tangentVector.setHeading(radians(atan(tm)));

      let p = new p5.Vector(tx, ty);
      let p2 = p.copy().add(tangentVector.mult(vectorMultiplier));
      p = p.sub(tangentVector.mult(vectorMultiplier));
      line(p.x, p.y, p2.x, p2.y);

    }
  } 
}