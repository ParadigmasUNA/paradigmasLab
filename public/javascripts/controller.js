let initEvents = () => {
    let themaze = new TheMaze();
    themaze.anchoCelda = 30;

$('#mongoPost').click( _ => fetch('http://localhost:3000/', {method: 'POST', headers: f(), body: JSON.stringify({name: 'soy una prueba :p'}) }) );
$('#mongoGet').click( _ => fetch('http://localhost:3000/', {method: 'GET', headers: f(), mode: 'cors', cache: 'default' })
                        .then(response => {console.log(response.text()); return response})
                        .then(response => (response.json())
                        .then(e => JSON.parse(e))
                        .then(e => console.log(e))
                        .catch(err => console.log(err))));

if(!themaze.remote){
    $('#mazeG').click( _ => fetch('http://localhost:3000/',{method: 'POST',headers:f(), body: JSON.stringify({opcion:'1', tamano: $("#dificultad")[0].value })})
                                 .then(response => response.json())
                                 .then(e => JSON.parse(e))
                                 .then(e => {
                                   initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda);
                                   return e;
                                 })
                                 .then(e => {themaze.maze = e; return e})
                                 .then(e => e.forEach(a=>mostrar(a,themaze.anchoCelda)))
                                 .catch(e => console.log(e)));

    $('#mazeSolve').click(_ => fetch('http://localhost:3000/',{method: 'POST',headers:f(), body: JSON.stringify({opcion:'2', tamano: $("#dificultad")[0].value, maze:JSON.stringify(themaze.maze)})})
                              .then(response => response.json())
                              .then(e => JSON.parse(e))
                              .then(e => {
                                  initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda);
                                  return e;
                                })
                              .then(e => {themaze.solutionMaze = e; return e})
                              .then(e=> {console.log(e); return e})
                              .then(e => e.forEach(a=>mostrar(a,themaze.anchoCelda)))
                              .catch(e => console.log(e))

                            );
  }
  else{
    //Generar Maze de forma local
    $('#mazeG').click( e => toPromise(e).then(_ => initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda))
                                        .then(e => new mazec.MazeGen())
                                        .then(e => e.init(parseInt($("#dificultad")[0].value)))
                                        .then(e => themaze.maze = e)
                                        .then(_=> themaze.maze.forEach(celda => mostrar(celda,themaze.anchoCelda)))
                                        .catch(e => console.log(e)));
    $('#mazeSolve').click(e => toPromise(e).then(_ => initCanvas(parseInt($("#dificultad")[0].value),themaze.anchoCelda))
                                           .then(_ => new mazec.SolveGen())
                                           .then(e => e.init(parseInt($("#dificultad")[0].value),themaze.maze))
                                           .then(e => e.forEach(celda => mostrar(celda,themaze.anchoCelda)))
                                           .catch(e => console.log(e)));
  }
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
