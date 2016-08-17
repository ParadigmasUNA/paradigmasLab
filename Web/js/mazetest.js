let laberinto = [];
//let hijos = [1,2,3,4]; //1-> Arriba, 2->Abajo, 3->Derecha, 4->Izquierda
let longCelda;
let canvas;
let columnas;
let filas;
let ctx;
let LEFT = 0;
let TOP = 1;
let RIGHT  = 2;
let BOTTOM = 3;

function prueba(){
  longCelda = 25;
  canvas = document.getElementById("mycanvas");
  columnas = document.getElementById('ancho').value;
  filas = document.getElementById('alto').value;
  canvas.width = columnas * longCelda;
  canvas.height = filas * longCelda;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  for(let x = 0; x < columnas; x++)
    for(let y = 0; y < filas; y++){
      //ctx.fillRect(x*longCelda,y*longCelda,longCelda,longCelda); //rellena el cuadro...
      ctx.moveTo(x*longCelda,y*longCelda);//Empieza a dibujar
      ctx.lineTo(x*longCelda,(y+1)*longCelda); //dibuja izquierda
      ctx.lineTo((x+1)*longCelda,(y+1)*longCelda); //dibuja abajo
      ctx.lineTo((x+1)*longCelda,y*longCelda); //dibuja derecha
      ctx.lineTo(x*longCelda,y*longCelda) //dibuja arriba
      ctx.stroke();
      celda(x,y,laberinto.length); //verificar despues si es length-1
    }
    drawBack();
}

function drawBack(){
  //hacer validacion
  let stack = []; //pila o cola
  let contadorV = 0;
  laberinto[0].visitado = true;
  let backtracking = (celdaActual,stack) => {
    celdaActual.visitado = true;
    contadorV++;
    if(contadorV<laberinto.length){ //Primer if del algoritmo de backtracking
      let i = celdaActual.index; //en este if verificamos si hay hijos sin visitar
      if((laberinto[i+1] && !laberinto[i+1].visitado && celdaActual.x+1 < parseInt(filas)) ||
      (laberinto[i-1] && !laberinto[i-1].visitado && celdaActual.x-1 > 0) ||
      (laberinto[i+parseInt(filas)] && !laberinto[i+parseInt(filas)].visitado && celdaActual.y+1 < parseInt(columnas)) ||
      (laberinto[i-parseInt(filas)] && !laberinto[i-parseInt(filas)].visitado && celdaActual.y-1 > 0)){
        let opciones = [];
        if(laberinto[i+1] && !laberinto[i+1].visitado && celdaActual.x+1 < parseInt(filas))
          opciones.push(1); //lado abajo
        if(laberinto[i-1] && !laberinto[i-1].visitado && celdaActual.x-1 >= 0)
          opciones.push(2); //lado arriba
        if(laberinto[i+parseInt(filas)] && !laberinto[i+parseInt(filas)].visitado && celdaActual.y+1 < parseInt(columnas))
          opciones.push(3); //lado derecha
        if(laberinto[i-parseInt(filas)] && !laberinto[i-parseInt(filas)].visitado && celdaActual.y-1 >= 0)
          opciones.push(4); //lado izquierdo
        //sacar el vecino al que se le va a hacer la mica
        let opcion = getRandom(opciones);
        //pusheamos la celdaActual a la pila
        stack.push(celdaActual);
        //remover pared entre ambas
        //revisar cual opcion fue
        let celdaVecina;
        if(opcion === 1){ //Escogio el vecino de Abajo
          celdaActual.bordes[BOTTOM] = false;
          celdaVecina = laberinto[celdaActual.index+1];
          celdaVecina.bordes[TOP] = false;
          limpiarRect(celdaActual.x,celdaActual.y);
          dibujarCelda(celdaActual.x,celdaActual.y,celdaActual.bordes);
          limpiarRect(celdaVecina.x,celdaVecina.y);
        //  dibujarSinTop(celdaVecina.x,celdaVecina.y);
          dibujarCelda(celdaVecina.x,celdaVecina.y,celdaVecina.bordes);
        }
        else if(opcion === 2){ //Escogio vecino de Arriba
          celdaActual.bordes[TOP] = false;
          celdaVecina = laberinto[celdaActual.index-1];
          celdaVecina.bordes[BOTTOM] = false;
          limpiarRect(celdaActual.x,celdaActual.y);
          dibujarCelda(celdaActual.x,celdaActual.y,celdaActual.bordes);
          limpiarRect(celdaVecina.x,celdaVecina.y);
          //dibujarSinBottom(celdaVecina.x,celdaVecina.y);

          dibujarCelda(celdaVecina.x,celdaVecina.y,celdaVecina.bordes);
        }
        else if(opcion === 3){ //Escogio vecino Derecho
          celdaActual.bordes[RIGHT] = false;
          celdaVecina = laberinto[celdaActual.index+parseInt(filas)];
          celdaVecina.bordes[LEFT] = false;
          limpiarRect(celdaActual.x,celdaActual.y);
          dibujarCelda(celdaActual.x,celdaActual.y,celdaActual.bordes);
          limpiarRect(celdaVecina.x,celdaVecina.y);
          //dibujarSinLeft(celdaVecina.x,celdaVecina.y);
          dibujarCelda(celdaVecina.x,celdaVecina.y,celdaVecina.bordes);
        }
        else if(opcion===4){ //Escogio vecino Izquierdo
          celdaActual.bordes[LEFT] = false;
          celdaVecina = laberinto[celdaActual.index-parseInt(filas)];
          celdaVecina.bordes[RIGHT] = false;
          limpiarRect(celdaActual.x,celdaActual.y);
          dibujarCelda(celdaActual.x,celdaActual.y,celdaActual.bordes);
          limpiarRect(celdaVecina.x,celdaVecina.y);
        //  dibujarSinRight(celdaVecina.x,celdaVecina.y);
          dibujarCelda(celdaVecina.x,celdaVecina.y,celdaVecina.bordes);
        }

        backtracking(celdaVecina,stack);
      }
      else if(stack.length>0){ //El primer else del algoritmo de backtracking
        backtracking(stack.pop(),stack)
      }
    }
  }
  backtracking(laberinto[0],[]);
  //(getRandom([1,3])==1)? backtracking(laberinto[0],[]) : backtracking(laberinto[parseInt(filas)],[])
}

function limpiarRect(x,y){
  ctx.clearRect(y*longCelda,x*longCelda,longCelda,longCelda);
  ctx.save();
}

let celda = (y,x,indice) => {
  coordenadas = { 'x': x, 'y':y,'visitado': false,'index':indice ,'bordes':[true,true,true,true]}
  laberinto.push(coordenadas);
}



let getRandom = (array) => array[Math.floor(Math.random()* array.length)]

function dibujarSinTop(x,y){
  ctx.beginPath();
  ctx.moveTo(x*longCelda,y*longCelda);//Empieza a dibujar
  ctx.lineTo((x+1)*longCelda,y*longCelda); //dibuja izquierda
  ctx.lineTo((x+1)*longCelda,(y+1)*longCelda); //dibuja abajo
  ctx.lineTo(x*longCelda,(y+1)*longCelda); //dibuja derecha
  ctx.stroke();
}
function dibujarSinBottom(x,y){
  ctx.beginPath();
  ctx.moveTo((x+1)*longCelda,y*longCelda);//Empieza a dibujar
  ctx.lineTo(x*longCelda,y*longCelda); //dibuja izquierda
  ctx.lineTo(x*longCelda,(y+1)*longCelda) //dibuja arriba
  ctx.lineTo((x+1)*longCelda,(y+1)*longCelda); //dibuja derecha
  ctx.stroke();
}
function dibujarSinLeft(x,y){
  ctx.beginPath();
  ctx.moveTo(x*longCelda,y*longCelda);//Empieza a dibujar
  ctx.lineTo(x*longCelda,(y+1)*longCelda) //dibuja arriba
  ctx.lineTo((x+1)*longCelda,(y+1)*longCelda); //dibuja derecha
  ctx.lineTo((x+1)*longCelda,y*longCelda); //dibuja abajo
  ctx.stroke();
}
function dibujarSinRight(x,y){
  ctx.beginPath();
  ctx.moveTo(x*longCelda,(y+1)*longCelda);//Empieza a dibujar
  ctx.lineTo(x*longCelda,y*longCelda) //dibuja arriba
  ctx.lineTo((x+1)*longCelda,y*longCelda); //dibuja izquierda
  ctx.lineTo((x+1)*longCelda,(y+1)*longCelda); //dibuja abajo
  ctx.stroke();
}
function dibujarCelda(x,y,bordes){
  if(bordes[TOP]){
    ctx.beginPath();
    ctx.moveTo(x*longCelda, y*longCelda);
    ctx.lineTo((x+1)*longCelda, y*longCelda);
    ctx.stroke();
   // ctx.endPath();
  }
  if(bordes[RIGHT]){
    ctx.beginPath();
    ctx.moveTo((x+1)*longCelda, y*longCelda);
    ctx.lineTo((x+1)*longCelda, (y+1)*longCelda);
    ctx.stroke();

  //  ctx.endPath();
  }
  if(bordes[BOTTOM]){
    ctx.beginPath();
    ctx.moveTo(x*longCelda, (y+1)*longCelda);
    ctx.lineTo((x+1)*longCelda, (y+1)*longCelda);
    ctx.stroke();
    //ctx.endPath();
  }
  if(bordes[LEFT]){
    ctx.beginPath();
    ctx.moveTo(x*longCelda, y*longCelda);
    ctx.lineTo(x*longCelda, y+1*longCelda);
    ctx.stroke();
    //ctx.endPath();
  }
  //ctx.endPath();
}
