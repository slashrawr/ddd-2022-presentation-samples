let cbShowRayOrigin;
let cbShowRay;
let cbShowObjects;
let cbShowDistances;
let sldSteps;

let ray;
let objects = [];

let maxSteps = 100;
let maxDistance = 300;
let minDistance = 1;
let maxObjects = 5;
let seed = 11266; //demo seed: 11266

let moveSpeed = 3;

function setup() {
  createCanvas(700, 700);
  frameRate(30);
  rectMode(CENTER);
  
  if (seed)
    randomSeed(seed);
  
  cbShowRayOrigin = createCheckbox("Show Ray Origin", true);
  cbShowRay = createCheckbox("Show Ray", true);
  cbShowObjects = createCheckbox("Show Objects", true);
  cbShowDistances = createCheckbox("Show Distances", true);
  sldSteps = createSlider(0,maxSteps,25,1);
  sldSteps.style("width", width + "px");
  
  ray = new Ray(width/2,height/2);
  
  for (let i = 0; i < maxObjects; i++) {
    objects.push(new WorldObject(i));
  }
}

function draw() {
  background(0);
  strokeWeight(0);
  
  if (frameCount % 2 == 0)
    moveRayOrigin();
  
  let currentPoint = ray.position.copy();
  ray.draw(cbShowRayOrigin.checked(), cbShowRay.checked());
  
  if (cbShowObjects.checked()) {
    for (let step = 0; step < sldSteps.value(); step++) {
      
      let currentSmallestDistance = maxDistance;
      let nearestObject = {};
      objects.forEach(obj => {
        fill(255);
        obj.draw();

        if (cbShowDistances.checked()) {
          let distance;
          switch (obj.type) {
            case 'circle' :
                distance = calcCircleDistance(obj, currentPoint);
              break;
            case 'square' :
              distance = calcRectDistance(obj, currentPoint);  
              break;
          }
          if (distance < currentSmallestDistance) {
                  currentSmallestDistance = distance;
                  nearestObject = obj;
          }
        }
      })

      if(currentSmallestDistance <= maxDistance && cbShowRay.checked()) {
        if (currentSmallestDistance <= minDistance) {
          fill(255,0,0,70);
          circle(currentPoint.x, currentPoint.y, 10*(abs(sin(frameCount*0.08))));
          
          textSize(32);
          fill(nearestObject.color);
          text('Reached surface: ' + nearestObject.id, 10, 70);
        }
        else {
          fill(255,255,255,70);
          circle(currentPoint.x, currentPoint.y, currentSmallestDistance*2);
          currentPoint.add(p5.Vector.mult(ray.direction, currentSmallestDistance));
        }
      }
      else
        break;
        
      fill(255,255,255);
      textSize(32);
      text('Steps: ' + sldSteps.value(), 10, 30);
    }
  }
}

function moveRayOrigin() {
  if (keyIsPressed) {
    if (keyIsDown(87)) { //W
      ray.position.y += moveSpeed;
    } 
    else if (keyIsDown(65)) { //A
      ray.position.x -= moveSpeed;
    }
    else if (keyIsDown(83)) { //S
      ray.position.y -= moveSpeed;
    }
    else if (keyIsDown(68)) { //D
      ray.position.x += moveSpeed;
    }
  }
}


function calcCircleDistance(c, currentPosition) {
  
  let P = currentPosition;
  let C = c.position;

  return dist(P.x, P.y, C.x, C.y) - c.size/2;
}

function calcRectDistance(r, currentPosition) {
  let P = p5.Vector.sub(currentPosition, r.position);

  let bx = r.size/2;
  let by = r.size/2;
  
  let qx = abs(P.x) - bx;
  let qy = abs(P.y) - by;
  
  return sqrt(pow(max(qx,0),2) + pow(max(qy,0),2)) + min(max(qx,qy),0);
}


//This function was used early on in development of this.
//It is no longer used but is a great piece of code for calculating
//the intersection of a ray with a circle. It helped me understand
//some of the vector maths behind the calculation so I wanted to keep
//it to refer back back to later.
//Source: https://www.bluebill.net/circle_ray_intersection.html
function calcCircleIntersection(c) {
  
  let P = ray.position;  //Ray origin
  let C = c.position;    //Circle centre
  let V = ray.direction;  //Ray direction
  let U = p5.Vector.sub(C, P);  //Vector from ray origin to circle centre
  let U1 = p5.Vector.mult(V, abs(p5.Vector.dot(U, V))); //Project vector to right angle to circle centre along the ray direction
  let U2 = p5.Vector.sub(U, U1);  //Vector forming right angle to centre to get distance
  let d = U2.mag();  //The distance to the centre of the circle from the right angle
  let r = c.size/2;  //Radius of the circle
  let m = sqrt(pow(r,2) - pow(d,2));  //Pythagorean theorem 
  let P1;
  let P2;
  
  if (d < r) { //Two intersections
    push();
    fill(0,255,255);
    P1 = p5.Vector.add(P, U1);
    P1.add(p5.Vector.mult(V,m));
    P2 = p5.Vector.add(P, U1);
    P2.sub(p5.Vector.mult(V,m));
    circle(P2.x, P2.y, 10*sin(frameCount*0.1));
    pop();
  }
  else if (d == r) { //Tangent - TODO: Confirm this works
    push();
    fill(0,255,255);
    P1 = p5.Vector.add(P, U1);
    P1.add(p5.Vector.mult(V,m));
    P2 = p5.Vector.add(P, U1);
    P2.sub(p5.Vector.mult(V,m));
    circle(P1.x, P1.y, (10*sin(frameCount*0.1))+5);
    circle(P2.x, P2.y, (10*sin(frameCount*0.1))+5);
    pop();
    console.debug("tangent");
  }  
  return P2;
}