let grid = []; //Vector para meter a todas las celdas en un array...
let line = (ctx,x1,y1,x2,y2) =>{  //Dibuja una linea desde un punto dado hasta otro
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

//Devuelve el contexto del canvas
let getCanvasContext = canvasId => document.getElementById(canvasId).getContext('2d');
//Devuelve el valor del campo ya parseado a integer
let getValueElement = id => parseInt(document.getElementById(id).value);
//Setea las dimensiones del canvas
let setCanvasSize = (columnas,filas,canvasId,anchoCelda) => {
    document.getElementById(canvasId).width = columnas * anchoCelda;
    document.getElementById(canvasId).height = filas * anchoCelda;
}

//Me dice si el indice esta fuera de los valores de la matriz
let index = (i,j,columnas,filas) => (i < 0 || j < 0 || i > columnas-1 || j > filas-1) ? -1 : i + j * columnas;

let createCanvasGrid = () => {
  let ctx = getCanvasContext('canvas');
  let anchoCelda = 40; //Es el ancho de cada celda
  let columnas = getValueElement('txtcolumnas'); //Valor entero del numero de columnas
  let filas = getValueElement('txtfilas'); //Valor entero del numero de filas
  setCanvasSize(columnas,filas,'canvas',anchoCelda); //Setea dimnesiones del canvas

  for (let j = 0; j < columnas; j++)  //Esto crea el grid del canvas... si se quisiera...
    for(let i = 0; i < filas; i++){
      line(ctx,j*anchoCelda,i*anchoCelda,j*anchoCelda,(i+1)*anchoCelda); //dibuja Izquierda
      line(ctx,j*anchoCelda,(i+1)*anchoCelda,(j+1)*anchoCelda,(i+1)*anchoCelda); //dibuja abajo
      line(ctx,(j+1)*anchoCelda,(i+1)*anchoCelda,(j+1)*anchoCelda,i*anchoCelda); //dibuja derecha
      line(ctx,(j+1)*anchoCelda,i*anchoCelda,j*anchoCelda,i*anchoCelda); //dibuja arriba
      grid.push(new Cell(i,j)); //Crear los objetos celda e ingresarlos al vector grid
    }
    drawMaze(ctx,grid);
}

let drawMaze = (ctx,grid) =>{
  let current = grid[0];
  current.visited = true;
  let stack = [];
  let backtracking = (actual,stack) =>{
    actual.mostrar(40);
    let next = actual.checkNeighbors();
    if(next){
      next.visited = true;
      stack.push(actual);
      quitarParedes(actual,next);
      backtracking(next,stack);
    }
    else if(stack.length > 0){
      backtracking(stack.pop(),stack);
    }
  }
  backtracking(current,stack);
}


function Cell(i,j){
  this.i = i;
  this.j = j;
  this.paredes = [true,true,true,true]; //0->Arriba | 1->Derecha | 2->Abajo | 3-> Izquierda
  this.visited = false;

  this.checkNeighbors = () => {
    let neighbors = [];
    let columnas = getValueElement('txtcolumnas');
    let filas = getValueElement('txtfilas');
    let top = grid[index(i,j-1,columnas,filas)];
    let rigth = grid[index(i+1,j,columnas,filas)];
    let bottom = grid[index(i,j+1,columnas,filas)];
    let left = grid[index(i-1,j,columnas,filas)];

    if(top && !top.visited)
      neighbors.push(top);
    if(rigth && !rigth.visited)
      neighbors.push(rigth);
    if(bottom && !bottom.visited)
      neighbors.push(bottom);
    if(left && !left.visited)
      neighbors.push(left);
    //Retorna un vecino aleatorio, sino tiene devuelve undefined
    return (neighbors.length > 0) ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
  }

  this.mostrar = ancho =>{
    let x = this.i * ancho;
    let y = this.j * ancho;
    let ctx = getCanvasContext('canvas');
    //ctx.stroke(255);
    if(this.paredes[0]) //Top
      line(ctx,x,y,x+ancho,y);
    if(this.paredes[1]) //Rigth
      line(ctx,x+ancho,y,x+ancho,y+ancho);
    if(this.paredes[2]) //Bottom
      line(ctx,x+ancho,y+ancho,x,y+ancho);
    if(this.paredes[3]) //Left
      line(ctx,x,y+ancho,x,y);
    if(this.visited){
      ctx.rect(x,y,ancho,ancho);
      ctx.fillStyle = '#B8FF3E';
      ctx.fill();
    }
  }
}

function quitarParedes(current,next){
  let x = current.i - next.i;
  if(x === 1){ //Si el vecino esta a la izquierda
    current.paredes[3] = false; //borrar izquierda
    next.paredes[1] = false;   //borrar derecha
  }
  else if(x === -1){
    next.paredes[3] = false; //borrar la izquierda
    current.paredes[1] = false; //borra la derecha
  }
  let y = current.j - next.j;
  if(y === 1){ //Si el vecino esta a abajo
    current.paredes[0] = false; //borrar bottom
    next.paredes[2] = false;   //borrar top
  }
  else if(y === -1){ //Si el vecino esta arriba
    next.paredes[0] = false; //borrar bottom
    current.paredes[2] = false; //borra top
  }
}
