const cells = require('./cells');
const Cell = cells.Cell;
class MazeGen{
  constructor(){
    this.init = (tam) => {
      let tamano = tam;
      let grid = [];
      this.pushCell(tamano,grid);
      this.drawMaze(grid,tamano);
      return grid;
    }

    this.drawMaze = (grid,tamano) => {
      let current = grid[0];
      current.visited = true;
      let backtracking = (actual,stack) =>{
      let next = actual.checkNeighbors(grid,[],tamano);
      if(next){
        next.visited = true;
        stack.push(actual);
        this.quitarParedes(actual,next);
        backtracking(next,stack);
      }
      else if(stack.length > 0){
        backtracking(stack.pop(),stack);
      }
    }
    backtracking(current,[]);
    }

    this.quitarParedes = (current, next)=>{
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
    this.pushCell = (tamano, grid) =>{
    for (let j = 0; j < tamano; j++)  //Esto crea el grid del canvas... si se quisiera...
      for(let i = 0; i < tamano; i++)
        grid.push(new Cell(i,j)); //Crear los objetos celda e ingresarlos al vector grid
    return grid;
    }
  }
}

class SolveGen{
  constructor(){
    this.init = (tam,maze) =>{
      let tamano = parseInt(tam);
      let grid = [];
      let ma = JSON.parse(maze);
      ma.forEach(e => grid.push(toCell(e)) && console.log(e));
      this.solveMaze(grid,tamano);
      return grid;
    }

    this.solveMaze = (grid,tamano) => {
      let current = grid[0];
      current.visited = true;
      let solvebacktracking = (actual,stack) => {
        let next = actual.checkWalls(grid,[],tamano);
        if(next){
          next.visited = true;
          stack.push(actual);
          this.makePath(actual,next);
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
    this.makePath = (current,next) =>{
      current.path = 1;
      next.path = 1;
    }
  }
}

let toCell = (e) => {
  let cell = new Cell(e.i,e.j);
  cell.paredes = e.paredes;
  return cell;
}

module.exports = {
  MazeGen: MazeGen,
  SolveGen: SolveGen
}
