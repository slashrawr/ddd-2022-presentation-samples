let types = ['circle', 'square']

class WorldObject {
  constructor(x,y,size){
    this.position = createVector(x,y);
    this.orientation = createVector(0,1);
    this.size = size;
    this.type = random(types);
  }
  
  draw(){
    push();
    stroke(255);
    strokeWeight(2);
    
    switch(this.type) {
      case 'circle' : 
        circle(this.position.x,this.position.y,this.size);
        break;
      case 'square' : 
        square(this.position.x,this.position.y,this.size);
        break;
    }
    
    pop();
  }
}