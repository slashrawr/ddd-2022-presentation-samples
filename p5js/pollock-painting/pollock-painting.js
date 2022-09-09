let aspect_ratio = 1;
let seed = 523452;
let stroke_count = 0;
let noise_scale = 0.02;
let centre = {};
let max_radius = 20;
let stroke_point = 0.5;
let max_steps = 100;
let step = 0;
let strokes = [];
let total_time = 0;
let noiseScalar = [0.00001, 0.0001];
let interval = 0.1; 
let palettes = [];
let palette = {};
let cap = "";

function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(700, 700);
  angleMode(RADIANS);
  colorMode(RGB);
  //randomSeed(seed);
  
  max_steps = random(100,1000);
  aspect_ratio = width / height;
  stroke_count = random(100, 500);
  centre = createVector(width/2,height/2);
  max_radius = random(5, 50);
  stroke_point = lerp(0.000001, 1.0, random(0.1, 0.5));
  noiseScalar = [random(0.000001, 0.000001), random(0.0002, 0.004)];
  interval = random(0.0001, 0.01);
  palette = palettes[int(random(0,199))];
  cap = random([ROUND,SQUARE,PROJECT]);
  
  for (let i = 0; i < stroke_count; i++) {
    strokes[i] = setStroke();
  }
  
  background(220);
}

function draw() {
  
  if (step < max_steps) {
    renderStroke(interval);
    step++;
  }
  else{
    noLoop();
  }

}

function renderStroke(interval) {
  total_time += interval;
  
  for (let i = 0; i < stroke_count; i++) {
    let s = strokes[i];
    
    let x = s.pos.x;
    let y = s.pos.y;
    
    let fx = constrain(round(x), 0, width - 1);
    let fy = constrain(round(y), 0, height - 1);

    let amplitude = random(0.0,1.0);
     
    let pS = lerp(noiseScalar[0], noiseScalar[1], amplitude);
    let n = noise(fx * pS, fy * pS, s.duration + total_time);
    let angle = (n*random(0,5.0)) * TWO_PI;
    let speed = s.speed + lerp(0.0, 2, 1 - amplitude);
    
    vec = new p5.Vector(cos(angle), sin(angle));
    s.velocity.add(vec);
    s.velocity.normalize();
    s.velocity.mult(speed);
    s.pos.add(s.velocity);
    
    let r = s.radius * noise(x * stroke_point, y * stroke_point, s.duration + total_time);
    r *= lerp(0.001, 1.0, amplitude);
    
    strokeWeight(r * (s.time / s.duration));
    stroke(s.colour);
    strokeCap(cap);
    
    line(x, y, s.pos.x, s.pos.y);
    
    s.time += interval;
    if (s.time > s.duration) {
      setStroke(s);
    }
  }
}

function setStroke(stroke) {
  let s = stroke || {};
  let col = random(palette);
  s.pos = randomPosition();
  s.radius = random(0.1, max_radius);
  s.duration = random(0, 300);
  s.time = random(0, s.duration);
  s.velocity = new p5.Vector(random(-1, 1), random(-1, 1));
  s.speed = random(0.1, 2) * aspect_ratio;
  s.colour = hexToRGB(col,random(0,255));
  
  return s;
}

function randomPosition() {
  let scale = random(0, (min(width, height) / 2.0) * random(0.0, 1.5));
  var r = random(0.0,1.0) * TWO_PI;
  let vec = new p5.Vector((cos(r) * scale) + (width / 2), (sin(r) * scale) + (height / 2));
  return vec;
}

function hexToRGB(hexColour, alpha) {
  var aRgbHex = hexColour.replace("#","").match(/.{1,2}/g);
  var aRgb = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ];
  return color(aRgb[0], aRgb[1], aRgb[2], alpha);
}