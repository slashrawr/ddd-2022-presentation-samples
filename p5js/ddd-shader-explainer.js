let cbVerts;
let cbMaterial;
let cbAmbientLight;
let cbDirectionLight;

let b = 300;

function setup() {
  createCanvas(800, 700, WEBGL);
  colorMode(RGB);
  cbVerts = createCheckbox('Vertices', true);
  cbMaterial = createCheckbox('Material', false);
  cbAmbientLight = createCheckbox('Ambient Light', false);
  cbDirectionLight = createCheckbox('Directional Light', false);
}

function draw() {
  background(220);
  stroke(0);
  if (cbAmbientLight.checked())
    ambientLight(0,255,0);
  
  
  ambientMaterial(color(255,255,255,cbMaterial.checked() ? 255 : 0));
  
  if (cbDirectionLight.checked())
    directionalLight(0,255,0, createVector(100,100,-100));
  
  push();
  translate(0,b+50,0);
  rotateX(PI/2);
  plane(1000,1000,1,1);
  pop();
  push();
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);
  
  box(b,b,b);
  if (cbVerts.checked()) {
    strokeWeight(10);
    stroke(255,0,0);
    point(b/2,b/2,b/2);
    point(-b/2,-b/2,-b/2);
    point(b/2,b/2,-b/2);
    point(b/2,-b/2,-b/2);
    point(-b/2,b/2,-b/2);
    point(-b/2,-b/2,b/2);
    point(-b/2,b/2,b/2);
    point(b/2,-b/2,b/2);
  }

  pop();
}