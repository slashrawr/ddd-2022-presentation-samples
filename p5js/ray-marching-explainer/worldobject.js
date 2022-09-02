let types = ['circle']

class WorldObject {
  constructor(x,y,size){
    this.position = createVector(x,y);
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
        square(0,0,this.size);
        break;
    }
    
    pop();
  }
}