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

let initEvents = () => {
    let themaze = new TheMaze();
    themaze.anchoCelda = 30;
    const URL = 'http://localhost:3000/'

    let genLocal = event => toPromise(event).then(_ => disappearWin())
                                            .then( _ => initCanvas(themaze) )
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
                          .then(_ => disappearWin())
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

    let estadoBotones = () => $("#tjuego").change(event => toPromise(event).then(_ => activarBotones())
                                                                           .catch(err => console.log(err)));

    $('#saveRemote').click( _ => fetch(URL+'saveMaze', {method: 'POST', headers: myheader(), body: JSON.stringify({maze: themaze}) }) );

    $('#remoteRecover').click( _ => fetch(URL+mazeNum(), {method: 'GET', headers: myheader(), mode: 'cors', cache: 'default' })
                                  .then(response => response.json())
                                  .then( response => {console.log(response[0].maze); return response;})
                                  .then( response => setTheMaze(response[0].maze))
                                  .then( _ => initCanvas(themaze))
                                  .then( _ => drawMaze(themaze.maze, themaze.anchoCelda))
                                  .then(_ => jugarContinuacion(themaze))
                                  .catch(err => console.log(err)));

    $('#mazeG').click( event =>toPromise(event).then(_=> tipoJuego() == 0  ? genRemote() : genLocal(event) )
                                               .then(_=> estadoBotones())
                                               .then(_ => activarBotones())
                                               .catch(err => console.log(err)) );

    $("input").prop('disabled', false);


    $('#mazeSolve').click( event =>toPromise(event).then(_ => (tipoJuego() == 0 ) ? solRemote() : solveLocal(event))
                                                   .then(_ => themaze.cursor.rastro = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6) )
                                                   .catch(err => console.log(err)));

    $('#saveLocal').click(event => toPromise(event).then( _ => saveLocal(themaze)));

    $('#recovery').click(event => toPromise(event).then( _ => retrieveLocal())
                                                  .then( newTheMaze => setTheMaze(newTheMaze) )
                                                  .then( _ => initCanvas(themaze, themaze.tamano) )
                                                  .then( _ => drawMaze(themaze.maze, themaze.anchoCelda) )
                                                  .then( _ => jugarContinuacion(themaze))
                                                  .catch(err => console.log(err)));

  let setMazeModel = maze => themaze.maze = maze;
  let setTheMaze = newTheMaze => themaze = newTheMaze;
  let setSolveMazeModel = maze => themaze.solutionMaze = maze;

  $('#saveImage').click(event => download());
}

let botonesRemotos = (_) => {
  $('#remoteRecover').removeAttr('disabled');
  $('#recovery').prop( "disabled", true);
  $('#saveLocal').prop( "disabled", true);
  $('#cargarRemoto').css( "display", 'inline');
}

let botonesLocales = (_) => {
  $('#recovery').removeAttr('disabled');
  $('#saveRemote').prop( "disabled", true);
  $('#cargarRemoto').css( "display", 'none');
}

let activarBotones = () => {
  $('#mazeSolve').removeAttr('disabled');
  $('#saveLocal').removeAttr('disabled');
  $('#saveRemote').removeAttr('disabled');
  $('#saveImage').removeAttr('disabled');
  localStorage.getItem('themaze') ?  $('#recovery').removeAttr('disabled')  :$('#recovery').prop( "disabled", true);
  tipoJuego() == 0 ? botonesRemotos() : botonesLocales();
}

let download = () => {
  var canvas = document.getElementById("canvas");
  var image = canvas.toDataURL();
  var aLink = document.createElement('a');
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click");
  aLink.download = 'image.jpg';
  aLink.href = image;
  aLink.dispatchEvent(evt);
}

let createMaze = () => new mazec.MazeGen();

let createSolveMaze = () => new mazec.SolveGen();

let drawMaze = (maze, anchoCelda) => maze.forEach(celda => mostrar(celda, anchoCelda));

let stringify = object => JSON.stringify(object);

let mazeNum = () => parseInt($('#id').val());

let tipoJuego = () => parseInt($("#tjuego")[0].value);

let tamanoActual = () => parseInt($("#dificultad")[0].value);

let initCanvas = (themaze, tamano = tamanoActual()) => { themaze.tamano = tamano; setCanvasSize(themaze.tamano,'canvas',themaze.anchoCelda)};

let toPromise = object => Promise.resolve(object);

let myheader = () => new Headers( { "Content-Type" : "application/json" } );

let disappearWin = () => $("#win").css('display','none');

let INTER;
let jugar = themaze => {
  $(window).off('keydown');
  (INTER)? clearInterval(INTER) : false;
  themaze.cursor = new Cursor();
  makeShip(themaze.cursor);
  INTER = setInterval(doGameLoop, 100,getCanvasContext("canvas"),themaze.cursor); // jugar hasta acabar
  $(window).on('keydown', e => whatKey(e,themaze.maze,themaze.cursor));
}

let jugarContinuacion = themaze => {
  $(window).off('keydown');
  (INTER)? clearInterval(INTER) : false;
  makeShip(themaze.cursor);
  INTER = setInterval(doGameLoop, 100,getCanvasContext("canvas"),themaze.cursor); // jugar hasta acabar
  $(window).on('keydown', e => whatKey(e,themaze.maze,themaze.cursor));
}

let saveLocal = themaze => {
  localStorage.setItem('themaze',JSON.stringify(themaze));
  $('#recovery').removeAttr('disabled');
}

let retrieveLocal = () => JSON.parse(localStorage.getItem('themaze'));
