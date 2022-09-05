let showAxis = false;
let seed = 135475;
let numberOfCircles = 7;
let radiusScale = 20;
let width = 1000;
let height = 500;
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
  smooth(8);
  background(0);
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
    stroke(random(0,255),random(0,255), random(0,255));
    
    for (i = 1; i <= 360; i++)
    {
      tx = v1.x + (c*radiusScale) * cos(i);
      ty = v1.y + (c*radiusScale) * sin(i);
      tm = -(1/((ty-v1.y)/(tx-v1.x))); //tangent slope

      let tangenVector = createVector(tx, ty);
      tangenVector.setHeading(radians(atan(tm)));

      if (i % (14 / c) == 0)
      {
        let p = new p5.Vector(tx, ty);
        let p2 = p.copy().add(tangenVector.mult(5));
        p = p.sub(tangenVector.mult(5));
        
        line(p.x, p.y, p2.x, p2.y);
      }
    }
  } 
}