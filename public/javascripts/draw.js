/*

Proyecto 1 | Paradigmas de Programación

II ciclo - 2016

Laberinto Remoto|Local

Grupo 1 - 8am

Carlos Artavia Pineda
Andrey Campos Sánchez
Fabián Hernández Chavarria
Omar Segura Villegas

2016

*/

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


//JUGARs
let HaceRastro = (contexto,Cursor) =>{
  contexto.beginPath();
  contexto.rect(Cursor.ActualX,Cursor.ActualY,30,30);
  contexto.fillStyle = '#A6AEBF';
  contexto.fill();
  contexto.closePath();
}

let makeShip = (Cursor) => {
  let ctx = getCanvasContext('canvas');
  ctx.rect(Cursor.ActualX,Cursor.ActualY,30,30);
  ctx.fillStyle = '#6F727F';
  ctx.fill();
  Cursor.ImgCursor = ctx.getImageData(Cursor.ActualX, Cursor.ActualY, 30, 30);// Save ship data.
  ctx.closePath();
}

let doGameLoop = (ctx,Cursor) => {
  ctx.putImageData(Cursor.ImgCursor, Cursor.ActualX,Cursor.ActualY);
}


function whatKey(evt, grid,Cursor) {
  grid.forEach(x => mostrar(x,30)); //reconstruye el maze
  muros = SaberMuros(grid,Cursor);
  Sabercell(grid,Cursor).path = 1;
  Cursor.AnteriorX = Cursor.ActualX;
  Cursor.AnteriorY = Cursor.ActualY;
  HaceRastro(getCanvasContext('canvas'),Cursor);
  Cursor.ActualX == (parseInt($("#dificultad")[0].value)-1)*30 && Cursor.ActualY == (parseInt($("#dificultad")[0].value)-1)*30  ? window.alert("GANOOO") && window.clearInterval(INTER)
  : false;
  switch (evt.keyCode) {

    case 37: //izquierda
      Cursor.ActualX = Cursor.ActualX- 30;
      Cursor.ActualX < 0 ? Cursor.ActualX = 0 &&  devolver(grid,Cursor): false;
      muros[3] ? devolver(grid,Cursor) :false;
      break;

    case 39: //derecha
      Cursor.ActualX = Cursor.ActualX + 30;
      (Cursor.ActualX >= (parseInt($("#dificultad")[0].value)*30)) ?  devolver(grid,Cursor): false;
      muros[1] ? devolver(grid,Cursor) :false;
      break;

    case 40: //abajo
      Cursor.ActualY = Cursor.ActualY  + 30;
      (Cursor.ActualY  >= (parseInt($("#dificultad")[0].value)*30)) ? devolver(grid,Cursor): false;
      muros[2] ? devolver(grid,Cursor) :false;
      break;

    case 38: //arriba
      Cursor.ActualY = Cursor.ActualY - 30;
      Cursor.ActualY < 0 ? Cursor.ActualY= 0 &&  devolver(grid,Cursor): false;
      muros[0] ? devolver(grid,Cursor) :false;
        break;
  }
}

let devolver = (grid,Cursor) => grid[Cursor.ActualX= Cursor.AnteriorX , Cursor.ActualY= Cursor.AnteriorY ];
let SaberMuros = (grid,Cursor) => grid[indice(Cursor)].paredes ;
let indice = (Cursor) => Cursor.ActualX/30 < 0 || Cursor.ActualY/30 < 0 || Cursor.ActualX/30 > (parseInt($("#dificultad")[0].value))-1 || Cursor.ActualY/30 > (parseInt($("#dificultad")[0].value))-1 ? -1 : Cursor.ActualX/30 + Cursor.ActualY/30 * (parseInt($("#dificultad")[0].value)) ;
let tamano_ = tam => parseInt($("#dificultad")[0].value)*tam;
let Sabercell = (grid,Cursor) => grid[indice(Cursor)];


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
    ctx.fillStyle = '#A6AEBF';
    ctx.fill();
  }
}
