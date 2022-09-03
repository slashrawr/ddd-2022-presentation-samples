class Ray {
    constructor(x,y) {
      this.position = createVector(x,y);
      this.direction = createVector(0,1);
    }
  
    draw(showRayOrigin, showRay) {
      push();
      stroke(255,0,0);
      strokeWeight(2);
      if (showRayOrigin)
        circle(this.position.x,this.position.y,10);
      
      if (showRay) {
        let mouse = createVector(mouseX,mouseY);
        this.direction = mouse.copy().sub(this.position).normalize();
        let proj = p5.Vector.add(this.position,p5.Vector.mult(this.direction,1000));
        line(this.position.x,this.position.y,proj.x,proj.y);
      }
      
      pop();
    }
  }