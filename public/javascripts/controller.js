let initEvents = () => {
    let themaze = new TheMaze();
    themaze.anchoCelda = 30;
    const URL = 'http://localhost:3000/'

    let genLocal = event => toPromise(event).then( _ => initCanvas(themaze) )
                                        .then( _ => createMaze() )
                                        .then( maze => maze.init(themaze.tamano) )
                                        .then( maze => setMazeModel(maze) )
                                        .then( _ => drawMaze(themaze.maze, themaze.anchoCelda) )
                                        .then( _ => jugar(themaze) )
                                        .catch( error => console.log(error) )

    let solveLocal = event => toPromise(event).then( _ => initCanvas(themaze) )
                                              .then( _ => createSolveMaze() )
                                              .then( maze => maze.init(themaze.tamano,themaze.maze) )
                                              .then( maze => setSolveMazeModel(maze) )
                                              .then( _ => drawMaze(themaze.solutionMaze, themaze.anchoCelda) )
                                              .catch( error => console.log(error))

    let genRemote = () => fetch(URL+'genMaze',{ method: 'POST', headers: myheader(), body: stringify({tamano: tamanoActual()}) })
                          .then( response => response.json() )
                          .then( json => JSON.parse(json) )
                          .then( maze => setMazeModel(maze) )
                          .then( _ => initCanvas(themaze) )
                          .then( _ => drawMaze(themaze.maze, themaze.anchoCelda) )
                          .then( _ =>jugar(themaze))
                          .catch( error => console.log(error))

    let solRemote = () => fetch(URL+'solveMaze', { method: 'POST', headers: myheader(), body: stringify({tamano: tamanoActual(), maze: stringify(themaze.maze)}) })
                          .then(response => response.json() )
                          .then( json => JSON.parse(json) )
                          .then( maze => setSolveMazeModel(maze))
                          .then( _ => initCanvas(themaze) )
                          .then( _ => drawMaze(themaze.solutionMaze, themaze.anchoCelda) )
                          .catch( error => console.log(error) )

$('#saveRemote').click( _ => fetch(URL+'mazes', {method: 'POST', headers: myheader(), body: JSON.stringify({id: String(contador), mazeGen: themaze}) }) );
$('#recoveryRemote').click( _ => fetch(URL+'mazes/'+String(contador), {method: 'GET', headers: myheader(), body: {id: '0'}, mode: 'cors', cache: 'default' })
                        .then(response => {console.log(response); return response})
                        .then(response => (response.json())
                        .then(e => e.forEach(i => console.log(i)))
                        .catch(err => console.log(err))));

  $('#mazeG').click( event => ( tipoJuego() == 0 ) ? genRemote() : genLocal(event) );

  $('#mazeSolve').click( event => ( tipoJuego() == 0 ) ? solRemote() : solveLocal(event) );

  $('#saveLocal').click(event => toPromise(event).then( _ => saveLocal(themaze)));

  $('#recovery').click(event => toPromise(event).then( _ => retrieveLocal())
                                                .then( newTheMaze => setTheMaze(newTheMaze) )
                                                .then( _ => initCanvas(themaze, themaze.tamano) )
                                                .then( _ => drawMaze(themaze.maze, themaze.anchoCelda) )
                                                .then( _ => jugar(themaze.maze)) );

  let setMazeModel = maze => themaze.maze = maze;
  let setTheMaze = newTheMaze => themaze = newTheMaze;
  let setSolveMazeModel = maze => themaze.solutionMaze = maze;
}

let createMaze = () => new mazec.MazeGen();

let createSolveMaze = () => new mazec.SolveGen();

let drawMaze = (maze, anchoCelda) => maze.forEach(celda => mostrar(celda, anchoCelda));

let stringify = object => JSON.stringify(object);

let tipoJuego = () => parseInt($("#tjuego")[0].value);

let tamanoActual = () => parseInt($("#dificultad")[0].value);

let contador = 0;

let initCanvas = (themaze, tamano = tamanoActual()) => { themaze.tamano = tamano; setCanvasSize(themaze.tamano,'canvas',themaze.anchoCelda)};

let toPromise = object => Promise.resolve(object);

let myheader = () => new Headers( { "Content-Type" : "application/json" } );

let jugar = themaze => {
  contador++;
  themaze.cursor = new Cursor();
  makeShip(themaze.cursor);
  INTER = window.setInterval(doGameLoop, 16,getCanvasContext("canvas"),themaze.cursor); // jugar hasta acabar
  window.addEventListener('keydown', e => whatKey(e,themaze.maze,themaze.cursor), true);
}

let saveLocal = themaze => localStorage.setItem('themaze',JSON.stringify(themaze));

let retrieveLocal = () => JSON.parse(localStorage.getItem('themaze'));
