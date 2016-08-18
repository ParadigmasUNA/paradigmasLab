let cols,rows;
let w = 20;
let grid = [];
let current;
let stack = [];

function setup(){
  createCanvas(400,400);
  cols = Math.floor(width/w);
  rows = Math.floor(height/w);
  for (let j = 0; j < rows; j++)
    for(let i = 0; i < cols; i++)
      grid.push(new Cell(i,j));

  current = grid[0];
}

function draw() {
  background(51);
  for(let i = 0; i < grid.length; i++)
    grid[i].show();
  current.visited = true;
  current.highlight();
  //Step 1
  let next = current.checkNeighbors();
  if(next){
    next.visited = true;
    //Step 2
    stack.push(current);
    //Step 3
    removeWalls(current,next);
    //Step 4
    current = next;
  }
  else if(stack.length>0){
    current = stack.pop();
  }
}

function index(i,j){
  if(i < 0 || j < 0 || i > cols-1 || j > rows-1)
    return -1;
  return i + j * cols;
}

function Cell(i,j){
  this.i = i;
  this.j = j;
  this.walls = [true,true,true,true]; //0->TOP,1->Rigth, 2->Bottom, 3->Left
  this.visited = false;

  this.checkNeighbors = function(){
    let neighbors = [];

    let top = grid[index(i,j-1)];
    let rigth = grid[index(i+1,j)];
    let bottom = grid[index(i,j+1)];
    let left = grid[index(i-1,j)];

    if(top && !top.visited)
      neighbors.push(top);
    if(rigth && !rigth.visited)
      neighbors.push(rigth);
    if(bottom && !bottom.visited)
      neighbors.push(bottom);
    if(left && !left.visited)
      neighbors.push(left);

    if(neighbors.length > 0){
      let r = Math.floor(random(0,neighbors.length));
      return neighbors[r];
    }
    else
      return undefined;
  }
  this.highlight = function(){
      let x = this.i*w;
      let y = this.j*w;
      noStroke();
      fill(0,0,0,0);
      rect(x,y,w,w);
  }

  this.show = function(){
    let x = this.i*w;
    let y = this.j*w;
    stroke(255);
    if(this.walls[0]) //Top
      line(x,y,x+w,y);
    if(this.walls[1]) //Rigth
      line(x+w,y,x+w,y+w);
    if(this.walls[2]) //Bottom
      line(x+w,y+w,x,y+w);
    if(this.walls[3]) //Left
      line(x,y+w,x,y);
    if(this.visited){
      noStroke();
      fill(255,255,0,100);
      rect(x,y,w,w);
    }

  }
}


function removeWalls(current,next){
  let x = current.i - next.i;
  if(x === 1){ //Si el vecino esta a la izquierda
    current.walls[3] = false; //borrar izquierda
    next.walls[1] = false;   //borrar derecha
  }
  else if(x === -1){
    next.walls[3] = false; //borrar la izquierda
    current.walls[1] = false; //borra la derecha
  }
  let y = current.j - next.j;
  if(y === 1){ //Si el vecino esta a abajo
    current.walls[0] = false; //borrar bottom
    next.walls[2] = false;   //borrar top
  }
  else if(y === -1){ //Si el vecino esta arriba
    next.walls[0] = false; //borrar bottom
    current.walls[2] = false; //borra top
  }
}
