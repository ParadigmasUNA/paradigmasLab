const WIDTH = 30;
let maze = [];
let mazeSol = [];
let init = () => setCanvasSize(parseInt($("#dificultad")[0].value),'canvas',WIDTH); //Setea dimnesiones del canvas

let toPromise = e => Promise.resolve(e);

let prueba = () => {
    $('#mazeG').click(e => toPromise(e).then(init)
                                       .then(mazeWorker('javascripts/mazeGen.js'))
                                       .catch(e => console.log(e)));

    $('#mazeSolve').click(e => toPromise(e).then(solveWorker('javascripts/solveGen.js'))
                                           .catch(e => console.log(e)));
    //console.log(maze); //
}
let mazeWorker = path => {
  worker = new Worker(path);
  worker.onmessage = event => JSON.parse(event.data).forEach( e => maze.push(toCell(e)) && mostrar(e,WIDTH));
  worker.onerror = e => console.log(e);
  worker.postMessage({tamano: $("#dificultad")[0].value});
}

let solveWorker = file =>{
  worker = new Worker(file);
  worker.onmessage = event => JSON.parse(event.data).forEach( e => mazeSol.push(toCellSol(e)) && mostrar(e,WIDTH));
  worker.onerror = e => console.log(e);
  worker.postMessage({tamano: $("#dificultad")[0].value, grid: JSON.stringify(maze)});
}
