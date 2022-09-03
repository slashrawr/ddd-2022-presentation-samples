let monochrome = false;

class WorldObject {
  constructor(id){
    let types = ['circle', 'square']
    this.position = createVector(random(width),random(height));
    this.orientation = createVector(0,1);
    this.size = random(300);
    this.type = random(types);
    if (monochrome)
      this.color = color(255);
    else
      this.color = random(this.buildColours());
    this.id = id;
  }
  
  draw(){
    push();
    strokeWeight(0);
    
    fill(this.color);
    switch(this.type) {
      case 'circle' : 
        circle(this.position.x,this.position.y,this.size);
        break;
      case 'square' : 
        square(this.position.x,this.position.y,this.size);
        break;
    }
    
    fill(255,255,255,170);
    textSize(this.size/2);
    textAlign(CENTER, CENTER);
    text(this.id, this.position.x, this.position.y);
    
    pop();
  }
  
  buildColours() {
    let colours = [];
    for (let i = 0; i < 10; i++) {
      let col = color(random(255), random(255), random(255));
      colours.push(col);
    }
    return colours;
  }
}