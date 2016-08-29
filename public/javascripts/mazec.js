(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.mazec = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const mutil = require('./util');
const index = mutil.index;

class Cell{
  constructor(i,j){
    this.i = i;
    this.j = j;
    this.paredes = [true,true,true,true]; //0->Arriba | 1->Derecha | 2->Abajo | 3-> Izquierda
    this.visited = false;
    this.path = 0;
    this.checkNeighbors = (grid, neighbors, dif) => {
      let top = grid[index(this.i,this.j-1,dif)];
      let rigth = grid[index(this.i+1,this.j,dif)];
      let bottom = grid[index(this.i,this.j+1,dif)];
      let left = grid[index(this.i-1,this.j,dif)];

      if(top && !top.visited)
        neighbors.push(top);
      if(rigth && !rigth.visited)
        neighbors.push(rigth);
      if(bottom && !bottom.visited)
        neighbors.push(bottom);
      if(left && !left.visited)
        neighbors.push(left);

      //Retorna un vecino aleatorio, sino tiene devuelve undefined
      return (neighbors.length > 0) ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
    }

    this.checkWalls = (grid, neighbors, dif) => {
      let top = grid[index(this.i,this.j-1,dif)];
      let rigth = grid[index(this.i+1,this.j,dif)];
      let bottom = grid[index(this.i,this.j+1,dif)];
      let left = grid[index(this.i-1,this.j,dif)];

      if(!this.paredes[0] && top && !top.visited)
          neighbors.push(top) //Ingresa el de arriba
      if(!this.paredes[1] && rigth && !rigth.visited)
          neighbors.push(rigth) //Ingresa el derecha
      if(!this.paredes[2] && bottom && !bottom.visited)
          neighbors.push(bottom) //Ingresa el de abajo
      if(!this.paredes[3] && left && !left.visited)
          neighbors.push(left) //Ingresa el de left

      return (neighbors.length > 0) ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
    }
  }
}

module.exports = {
  Cell: Cell
}

},{"./util":3}],2:[function(require,module,exports){
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
      maze.forEach(e => grid.push(toCell(e)) && console.log(e));
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

},{"./cells":1}],3:[function(require,module,exports){
const cells = require('./cells');
const Cell = cells.Cell;

  //Me dice si el indice esta fuera de los valores de la matriz
  let index = (x,y,tamano) => {
    return  (x < 0 || y < 0 || x > tamano-1 || y > tamano-1) ? -1 : x + y * tamano;
  }

module.exports = {
  index : index
}

},{"./cells":1}]},{},[2])(2)
});
