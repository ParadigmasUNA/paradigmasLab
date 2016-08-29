let line = (ctx,x1,y1,x2,y2) =>{  //Dibuja una linea desde un punto dado hasta otro
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

//Devuelve el contexto del canvas
let getCanvasContext = canvasId => document.getElementById(canvasId).getContext('2d');
//Setea las dimensiones del canvas
let setCanvasSize = (tamano,canvasId,anchoCelda) => {
    document.getElementById(canvasId).width = tamano * anchoCelda+30;
    document.getElementById(canvasId).height = tamano * anchoCelda+30;
}



/********* JUGAR ************/



var ship = new Image(); // ship
var shipX = 0; // current ship position X
var shipY = 0; // current ship position Y
var oldShipX = 0; // old ship position var
var oldShipY = 0; // old ship position Y
var back = new Image();
var fondo = new Image();
var rastro = new Image();

function HaceRastro(contexto){
  contexto.putImageData(fondo,oldShipX, oldShipY);
  contexto.fillStyle ="red";
  contexto.beginPath();
  contexto.arc(5,5,4,0,Math.PI*2,true);
  contexto.closePath();
  contexto.fill();
  rastro=contexto.getImageData(0, 0, 30, 30); //guardo la pelota de rastro.
  contexto.putImageData(rastro,oldShipX, oldShipY);
}

function makeShip() {
  let ctx = getCanvasContext('canvas');
  fondo = ctx.getImageData(5, 5,23, 23);
  ctx.beginPath();
  ctx.moveTo(22.3, 12.0);
  ctx.bezierCurveTo(22.3, 13.3, 19.4, 14.3, 15.9, 14.3);
  ctx.bezierCurveTo(12.4, 14.3, 9.6, 13.3, 9.6, 12.0);
  ctx.bezierCurveTo(9.6, 10.8, 12.4, 9.7, 15.9, 9.7);
  ctx.bezierCurveTo(19.4, 9.7, 22.3, 10.8, 22.3, 12.0);
  ctx.closePath();
  ctx.fillStyle = "rgb(0, 190, 255)";
  ctx.fill();
  ship = ctx.getImageData(0, 0, 30, 30);// Save ship data.
  ctx.putImageData(fondo, 2, 2);// Erase it for now.
}

function doGameLoop() {
  let ctx = getCanvasContext('canvas');
  // pone en la nuevo posicion

// pone en la posicion anterior
  //HaceRastro(ctx);
  //ship = ctx.getImageData(2, 2, 28, 28);

  ctx.putImageData(ship, shipX, shipY);
  //HaceRastro(ctx);

  //ctx.putImageData(fondo,oldShipX, oldShipY);

//  rastro=contexto.getImageData(0, 0, 30, 30); //guardo la pelota de rastro



}


function whatKey(evt, grid) {

  grid.forEach(x => mostrar(x,30)); //reconstruye el maze
  //muros = SaberMuros(shipX,shipY);
  HaceRastro(getCanvasContext('canvas'));
  console.log(Sabercell(oldShipX,oldShipY,grid));
  mostrar(Sabercell(oldShipX,oldShipY,grid),30);
  //guarda posicion antes del intento
  let a= oldShipX;
  oldShipX = shipX;
  oldShipY = shipY;
  console.log(evt.keyCode);
  switch (evt.keyCode) {

    case 37: //izquierda
    shipX = shipX - 30;
    console.log(shipX);
    console.log(shipY);
    shipX < 0 ? shipX = 0 &&  devolver(oldShipX,oldShipY,grid): false;
    //muros[3] ? devolver(oldShipX,oldShipY) :false;
    break;

    case 39: //derecha
    shipX = shipX + 30;
    (shipX >= (parseInt($("#dificultad")[0].value)*30)) ?  devolver(oldShipX,oldShipY,grid): false;
    //  muros[1] ? devolver(oldShipX,oldShipY) :false;
    break;

    case 40: //abajo
    shipY = shipY + 30;
    (shipY >= (parseInt($("#dificultad")[0].value)*30)) ? devolver(oldShipX,oldShipY,grid): false;
    // muros[2] ? devolver(oldShipX,oldShipY) :false;
    break;

    case 38: //arriba
    shipY = shipY - 30;
    shipY < 0 ? shipY = 0 &&  devolver(oldShipX,oldShipY,grid): false;
    //muros[0] ? devolver(oldShipX,oldShipY) :false;
    break;
  }
}

let devolver = (oldX,oldY,grid) => grid[shipX = oldX , shipY = oldY];
let SaberMuros = (x,y,grid) => grid[indice((y/30),(x/30),30)].paredes;
let indice = (x,y,tamano) => (x < 0 || y < 0 || x > tamano-1 || y > tamano-1) ? -1 : x + y * tamano;
let tamano_ = tam => parseInt($("#dificultad")[0].value)*tam;
let Sabercell = (x,y,grid) => grid[indice((y/30),(x/30),30)];


let mostrar = (cell,ancho) =>{
  let x = cell.i * ancho;
  let y = cell.j * ancho;
  let ctx = getCanvasContext('canvas');
  if(cell.paredes[0]) //Top
    line(ctx,x,y,x+ancho,y);
  if(cell.paredes[1]) //Rigth
    line(ctx,x+ancho,y,x+ancho,y+ancho);
  if(cell.paredes[2]) //Bottom
    line(ctx,x+ancho,y+ancho,x,y+ancho);
  if(cell.paredes[3]) //Left
    line(ctx,x,y+ancho,x,y);
  if(cell.path == 1){
    ctx.rect(x,y,ancho,ancho);
    ctx.fillStyle = '#B8FF3E';
    ctx.fill();
  }
}
