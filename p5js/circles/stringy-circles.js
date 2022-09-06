let seed = 733566;
let numberOfCircles = 6;
let radiusScale = 30;
let width = 700;
let height = 700;
let vectorMultiplier = 5;
let xOffset = width/2;
let yOffset = height/2;

function setup() {
  createCanvas(width, height);
  noLoop();
  colorMode(RGB);
  blendMode(ADD);
}

function draw() {
  background(0, 0, 0);
  randomSeed(seed);
  
  let v1 = createVector(random(width), random(height));
  
  for (c = 1; c <= numberOfCircles; c++)
  {
    let col = color(random(0,255), random(0,255), random(0,255), 10);
    stroke(col);
    strokeWeight(1);
    
    for (i = 1; i <= 800; i++)
    {
      let rndang = random(TWO_PI);
      tx = v1.x + (radiusScale*c) * cos(rndang);
      ty = v1.y + (radiusScale*c) * sin(rndang);
      tm = -(1/((ty-v1.y)/(tx-v1.x)));

      let tangentVector = createVector(tx, ty);
      tangentVector.setHeading(atan(tm));

      let p = new p5.Vector(tx, ty);
      let p2 = p.copy().add(tangentVector.mult(vectorMultiplier));
      p = p.sub(tangentVector.mult(vectorMultiplier));
      line(p.x, p.y, p2.x, p2.y);
    }
  } 
} 