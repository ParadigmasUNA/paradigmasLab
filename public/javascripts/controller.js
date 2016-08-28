let initEvents = () => {
    let themaze = new TheMaze();
    themaze.anchoCelda = 30;

if(themaze.remote){
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
