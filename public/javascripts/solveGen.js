onmessage = function(event){
  let tamano = parseInt(event.data.tamano);
  gridd = [];
  JSON.parse(event.data.grid).forEach(e => gridd.push(toCell(e)));
  solveMaze(gridd,tamano);
  postMessage(JSON.stringify(gridd));
}

let solveMaze = (grid,tamano) =>{
  let current = grid[0];
  current.visited = true;
  let solvebacktracking = (actual,stack) => {
    let next = actual.checkWalls(grid,[],tamano);
    if(next){
      next.visited = true;
      stack.push(actual);
      makePath(actual,next);
      solvebacktracking(next,stack);
    }
    else if(actual.i==tamano-1 && actual.j==tamano-1) return grid;
    else{
      let anterior = stack.pop();
      actual.path = 0;
      solvebacktracking(anterior,stack);
    }
  }
  return solvebacktracking(current,[]);
}


let makePath = (current,next) =>{
  current.path = 1;
  next.path = 1;
}
importScripts('cells.js');
