let circles = [];
let growRate = 1;
let startRadius = 2;
let circlesPerFrame = 1;
let swidth = 2;
let attemptLimit = 100;
let palettes = [];
let palette = {};

function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(700, 700);
  palette = palettes[int(random(0,199))];
}

function draw() {
  background(0);
  
  if (attemptLimit > 0) {
    for (let i = 0; i < circlesPerFrame; i++) {
      let c = {};
      c.position = getPosition();
      if (!c.position)
        break;
      c.radius = startRadius;
      c.growing = true;
      c.color = hexToRGB(random(palette), 255);
      circles.push(c);
    }
  }
  
  circles.forEach(c => {
    growCircle(c);
  })
  
}

function getPosition() {
  let position;
  let attempts = 10;
  let exit = false;
  
  if (circles.length == 0) {
    return createVector(random(width), random(height));
  }
    
  for (let i = 10; i > 0; i--) {
    position = createVector(random(width), random(height));
    for (let c of circles) {
      if (position.dist(c.position) <= c.radius + swidth) {
        exit = false;
        break;
      }
      else
        exit = true;
    }
    
    if (exit)
      return position;
  }
  
  attemptLimit--;
  console.debug(attemptLimit);
  return null;
}

function growCircle(c) {
  if (c.position.x + c.radius > width - swidth || c.position.x - c.radius < 0 + swidth || c.position.y + c.radius > height - swidth || c.position.y - c.radius < 0 + swidth)
    c.growing = false;
  
  for (let c2 of circles) {
    if (c != c2) {
      if (c.position.dist(c2.position) < c.radius + c2.radius) {
        c.growing = false;
        break;
      }
    } 
  }
  
  if (c.growing) {
    c.radius += growRate;
  }
  
  stroke(255);
  fill(c.color);
    strokeWeight(swidth);
    //noFill();
    circle(c.position.x, c.position.y, c.radius*2);
}

function hexToRGB(hexColour, alpha) {
  var aRgbHex = hexColour.replace("#","").match(/.{1,2}/g);
  var aRgb = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ];
  let colour = color(aRgb[0], aRgb[1], aRgb[2], alpha);
  return colour;
}