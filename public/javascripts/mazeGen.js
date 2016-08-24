onmessage = function(event){
  let tamano = parseInt(event.data.tamano);
  let grid = [];
  pushCell(tamano,grid);
  drawMaze(grid,tamano);
  postMessage(JSON.stringify(grid));
}

let drawMaze = (grid,tamano) =>{
  let current = grid[0];
  current.visited = true;
  let backtracking = (actual,stack) =>{
    let next = actual.checkNeighbors(grid,[],tamano);
    if(next){
      next.visited = true;
      stack.push(actual);
      quitarParedes(actual,next);
      backtracking(next,stack);
    }
    else if(stack.length > 0){
      backtracking(stack.pop(),stack);
    }
  }
  backtracking(current,[]);
}

let pushCell = (tamano,grid) =>{
  for (let j = 0; j < tamano; j++)  //Esto crea el grid del canvas... si se quisiera...
    for(let i = 0; i < tamano; i++)
      grid.push(new Cell(i,j)); //Crear los objetos celda e ingresarlos al vector grid
  return grid;
}

function quitarParedes(current,next){
  let x = current.i - next.i;
  if(x === 1){ //Si el vecino esta a la izquierda
    current.paredes[3] = false; //borrar izquierda
    next.paredes[1] = false;   //borrar derecha
  }
  else if(x === -1){
    next.paredes[3] = false; //borrar la izquierda
    current.paredes[1] = false; //borra la derecha
  }
  let y = current.j - next.j;
  if(y === 1){ //Si el vecino esta a abajo
    current.paredes[0] = false; //borrar bottom
    next.paredes[2] = false;   //borrar top
  }
  else if(y === -1){ //Si el vecino esta arriba
    next.paredes[0] = false; //borrar bottom
    current.paredes[2] = false; //borra top
  }
}
importScripts('cells.js');
