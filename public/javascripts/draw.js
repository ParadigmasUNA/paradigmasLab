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
  contexto.fillStyle ="red";
  contexto.beginPath();
  contexto.rect(shipX,shipY,30,30);
  contexto.fillStyle = '#B8FF3E';
  contexto.fill();
  contexto.closePath();
}

function makeShip() {
  let ctx = getCanvasContext('canvas');
  ctx.rect(shipX,shipY,30,30);
  ctx.fillStyle = '#FF530D';
  ctx.fill();
  ctx.closePath();
  fondo = ctx.getImageData(5, 5,23, 23);
  ship = ctx.getImageData(0, 0, 30, 30);// Save ship data.
  ctx.putImageData(fondo, 0, 0);// Erase it for now.
}

function doGameLoop() {
  let ctx = getCanvasContext('canvas');
  ctx.putImageData(ship, shipX, shipY);
  shipX == (parseInt($("#dificultad")[0].value)-1)*30 && shipY == (parseInt($("#dificultad")[0].value)-1)*30  ? alert("tomela Andrey grande y peluda") && clearInterval()
  : false;
}


function whatKey(evt, grid) {
  grid.forEach(x => mostrar(x,30)); //reconstruye el maze
  muros = SaberMuros(shipX,shipY,grid);
  console.log(Sabercell(oldShipX,oldShipY,grid));
  mostrar(Sabercell(oldShipX,oldShipY,grid),30);
  let a= oldShipX;
  oldShipX = shipX;
  oldShipY = shipY;
  HaceRastro(getCanvasContext('canvas'));
  switch (evt.keyCode) {

    case 37: //izquierda
      shipX = shipX - 30;
      shipX < 0 ? shipX = 0 &&  devolver(oldShipX,oldShipY,grid): false;
      console.log("izq con x: "+shipX+" y: "+shipY+" indice: "+indice(shipX/30,shipY/30,30));
      muros[3] ? devolver(oldShipX,oldShipY,grid) :false;
    break;

    case 39: //derecha
      shipX = shipX + 30;
      (shipX >= (parseInt($("#dificultad")[0].value)*30)) ?  devolver(oldShipX,oldShipY,grid): false;
      console.log("dere con x: "+shipX+" y: "+shipY+" indice: "+indice(shipX/30,shipY/30,30));
      muros[1] ? devolver(oldShipX,oldShipY,grid) :false;
    break;

    case 40: //abajo
      shipY = shipY + 30;
      (shipY >= (parseInt($("#dificultad")[0].value)*30)) ? devolver(oldShipX,oldShipY,grid): false;
      console.log("abajo con x: "+shipX+" y: "+shipY+" indice: "+indice(shipX/30,shipY/30,30));
      muros[2] ? devolver(oldShipX,oldShipY,grid) :false;
    break;

    case 38: //arriba
      shipY = shipY - 30;
      shipY < 0 ? shipY = 0 &&  devolver(oldShipX,oldShipY,grid): false;
      console.log("arriba con x: "+shipX+" y: "+shipY+" indice: "+indice(shipX/30,shipY/30,30) );
      muros[0] ? devolver(oldShipX,oldShipY,grid) :false;
    break;
  }
}

let devolver = (oldX,oldY,grid) => grid[shipX = oldX , shipY = oldY];
let SaberMuros = (x,y,grid) => grid[indice((y/30),(x/30),30)].paredes;
//let indice = (x,y,tamano) => (x < 0 || y < 0 || x > tamano-1 || y > tamano-1) ? -1 : x + y * tamano;
function indice (y,x,tamano){
  if(x < 0 || y < 0 || x > (parseInt($("#dificultad")[0].value))-1 || y > (parseInt($("#dificultad")[0].value))-1)
  return -1;
  else {
    return (x + y * (parseInt($("#dificultad")[0].value)));
  }
}
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
