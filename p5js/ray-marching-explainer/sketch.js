let ray;
let objects = [];

let maxSteps = 10;
let maxDistance = 500;
let minDistance = 100

function setup() {
  createCanvas(800, 800);
  frameRate(30);
  ray = new Ray(width/2,height/2);
  objects.push(new WorldObject(width/2, 100, 100));
  objects.push(new WorldObject(200, 600, 150));
}

function draw() {
  background(0);
  strokeWeight(0);
  let currentPoint = ray.position.copy();
  ray.draw();
  
  for (let step = 0; step < maxSteps; step++) {
    let currentSmallestDistance = maxDistance;
    objects.forEach(obj => {
      fill(255);
      obj.draw();
      calcCircleIntersection(obj);

      switch (obj.type) {
        case 'circle' :
          let intersection = calcCircleDistance(obj, currentPoint);
          //console.debug(intersection);
          if (intersection) {
            let distance = currentPoint.dist(intersection);
            if (distance < currentSmallestDistance) {
              currentSmallestDistance = distance;
            }
          }
          break;
      }
    })
    
    if(currentSmallestDistance < maxDistance) {
      fill(255,255,255,70);
      circle(currentPoint.x, currentPoint.y, currentSmallestDistance*2);
      currentPoint.add(p5.Vector.mult(ray.direction, currentSmallestDistance));
    }
    else
      break;
  }
}

function calcCircleIntersection(c) {
  //https://www.bluebill.net/circle_ray_intersection.html
  
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

function calcCircleDistance(c, currentPosition) {
  //https://www.bluebill.net/circle_ray_intersection.html
  
  let P = currentPosition;  //Ray origin
  let C = c.position;    //Circle centre
  //let V = ray.direction;  //Ray direction
  let D = p5.Vector.sub(P, C).normalize();  //Vector from ray origin to circle centre
  let R = p5.Vector.add(c.position,p5.Vector.mult(D,c.size/2));
  
  
  return R;
}