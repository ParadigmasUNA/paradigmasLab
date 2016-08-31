let initEvents = () => {
    let themaze = new TheMaze();
    themaze.anchoCelda = 30;

let genLocal = event => toPromise(event).then(_ => initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda))
                                        .then(e => new mazec.MazeGen())
                                        .then(e => e.init(parseInt($("#dificultad")[0].value)))
                                        .then(e =>themaze.maze = e)
                                        .then(_ => themaze.tamano = parseInt($("#dificultad")[0].value))
                                        .then(_=> themaze.maze.forEach(celda => mostrar(celda, themaze.anchoCelda)))
                                        .then( _=> jugar(themaze))
                                        .catch(e => console.log(e))

let solveLocal = event => toPromise(event).then(_ => initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda))
                                          .then(_ => new mazec.SolveGen())
                                          .then(e => e.init(parseInt($("#dificultad")[0].value),themaze.maze))
                                          .then(e => e.forEach(celda => mostrar(celda,themaze.anchoCelda)))
                                          .catch(e => console.log(e))

let genRemote = () => fetch('http://localhost:3000/',{method: 'POST',headers:f(), body: JSON.stringify({opcion:'1', tamano: $("#dificultad")[0].value })})
                      .then(response => response.json())
                      .then(e => JSON.parse(e))
                      .then(e => {
                          initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda);
                          return e; })
                      .then(e => {themaze.maze = e; return e})
                      .then(e => themaze.maze.forEach(a=>mostrar(a,themaze.anchoCelda)))
                      .then( _=>jugar(themaze))
                      .catch(e => console.log(e))

let solveRemote = () => fetch('http://localhost:3000/',{method: 'POST',headers:f(), body: JSON.stringify({opcion:'2', tamano: $("#dificultad")[0].value, maze:JSON.stringify(themaze.maze)})})
                      .then(response => response.json())
                      .then(e => JSON.parse(e))
                      .then(e => {
                          initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda);
                          return e; })
                      .then(e => {themaze.solutionMaze = e; return e})
                      .then(e=> {console.log(e); return e})
                      .then(e => e.forEach(a=>mostrar(a,themaze.anchoCelda)))
                      .catch(e => console.log(e))


  $('#mazeG').click( event => (parseInt($("#tjuego")[0].value) == 0 )? genRemote() : genLocal(event) );

  $('#mazeSolve').click( event => (parseInt($("#tjuego")[0].value)==0)? solveRemote() : solveLocal(event) );

  $('#saveLocal').click(e => toPromise(e).then(_=> saveLocal(themaze)));

  $('#recovery').click(e => toPromise(e).then(e => retrieveLocal())
                                          .then(e => themaze = e)
                                          .then(_ => initCanvas(themaze.tamano,themaze.anchoCelda))
                                          .then(_=> themaze.maze.forEach(celda => mostrar(celda,themaze.anchoCelda)))
                                          .then( _=> jugar(themaze.maze)));
}

let initCanvas = (tamano,ancho) =>{
  setCanvasSize(tamano,'canvas',30);
}

let toPromise = e => Promise.resolve(e);

let f = ()=>{
  let myHeaders = new Headers({
  "Content-Type": "application/json"
  });
  return myHeaders;
}

let jugar = (themaze) => {
  themaze.cursor = new Cursor();
  makeShip(themaze.cursor);
  INTER = window.setInterval(doGameLoop, 16,getCanvasContext("canvas"),themaze.cursor); // jugar hasta acabar
  window.addEventListener('keydown', e => whatKey(e,themaze.maze,themaze.cursor), true);
}

let saveLocal = (themaze) => {
    localStorage.setItem('themaze',JSON.stringify(themaze));
}
let retrieveLocal = () => {
  let themaze = localStorage.getItem('themaze');
  themaze = JSON.parse(themaze);
  return themaze;
}
