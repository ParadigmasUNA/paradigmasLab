let init = () => {
  //let ctx = getCanvasContext('canvas');
  let anchoCelda = 30; //Es el ancho de cada celda
  setCanvasSize(parseInt($("#dificultad")[0].value),'canvas',anchoCelda); //Setea dimnesiones del canvas

  let worker = new Worker('javascripts/mazeGen.js');
  worker.onmessage = event => JSON.parse(event.data).forEach((e)=> mostrar(e,anchoCelda));;
  worker.onerror = (e) => console.log(e);
  tam = $("#dificultad")[0].value;
  worker.postMessage({tamano: tam});

}
