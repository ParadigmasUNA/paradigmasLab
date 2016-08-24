const WIDTH = 30;

let init = () => setCanvasSize(parseInt($("#dificultad")[0].value),'canvas',WIDTH); //Setea dimnesiones del canvas

let toPromise = e => Promise.resolve(e);

let prueba = () => {
    $('#mazeG').click(e => toPromise(e).then(init)
                                       .then(mazeWorker('javascripts/mazeGen.js'))
                                       .catch(e => console.log()));
}
let mazeWorker = file => {
  worker = new Worker(file);
  worker.onmessage = event => JSON.parse(event.data).forEach((e) => mostrar(e,WIDTH));
  worker.onerror = e => console.log(e);
  worker.postMessage({tamano: $("#dificultad")[0].value});
}
