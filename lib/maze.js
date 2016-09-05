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

const cells = require('./cells');
const Cell = cells.Cell;

/**
* Clase generadora de laberinto
* Requiere el módulo {@link cell.js}
* @class
* @requires cells.js
*/

class MazeGen{
  /**
  * Genera un laberinto aleatorio
  * @returns {object} Retorna un laberinto de espacios aletorios
  */
  constructor(){
    this.init = tamano => this.drawMaze( this.initMaze(tamano , []), tamano);

    /**
    * Dibuja laberinto
    *@function drawMaze
    *@param {array} grid - array de celdas
    *@param {number} tamano - ancho de celda
    */
    this.drawMaze = (grid, tamano) => {
      grid[0].visited = true;
      /**
      * Backtracking
      *@function backtracking
      *@param {cell} actual - celda actual
      *@param {array} stack - pila de opciones
      *@returns {array} Retorna arreglo de paredes vecinas
      */
      let backtracking = (actual, stack) => {
        let revisaVecino = next => {
          if(next){
            next.visited = true;
            stack.push(actual);
            this.quitarParedes(actual, next);
            backtracking(next, stack);
          }
          else if(stack.length > 0)
            backtracking(stack.pop(), stack);
      }
      revisaVecino(actual.checkNeighbors(grid, [], tamano));
    }
    backtracking(grid[0], []);
    return grid;
    }

    /**
    * Remueve paredes
    *@function quitarParedes
    *@param {cell} current - celda actual
    *@param {cell} next - celdas vecina
    */

    this.quitarParedes = (current, next)=>{ //Falta FP
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

    /**
    * Inicializa laberinto
    *@function initMaze
    *@param {number} tamano - ancho de la celda
    *@param {array} grid - cuadrícula
    *@returns {array} Laberinto
    */

    this.initMaze = (tamano, grid) => {
      Array.from({length: tamano},(v , j) => Array.from({length:tamano},(v,i) => grid.push(new Cell(i,j))));
      return grid;
    }
  }
}

/**
* Clase solucionadora de laberinto
* Requiere el módulo {@link util.js}
* @class
* @requires cells.js
*/

class SolveGen{
  /**
  * Genera la solución del laberinto
  * @returns {object} Retorna un arreglos de celdas de acuerdo a la solución en la cuadrícula
  */
  constructor(){
    this.init = (tamano,maze) =>{
      return this.solveMaze( initSolve(JSON.parse(maze), []), tamano);
      //return grid;
    }

    /**
    * Encuentra solución al laberinto
    *@function solveMaze
    *@param {array} grid - cuadrícula (laberinto)
    *@param {number} tamano - ancho de la celda
    */
    this.solveMaze = (grid,tamano) => {
      grid[0].visited = true;
      /**
      * Resolución por medio de backtracking
      *@function solvebacktracking
      *@param {cell} actual - celda actual
      *@param {array} stack - pila de opciones
      *@returns {array} Laberinto
      */
      let solvebacktracking = (actual, stack) => {
        /**
        * Asegura si el vecino es parte de la solución
        *@function revisaVecino
        *@param {cell} next - celda vecina
        */
        let revisaVecino = next => {
          if(next){
            next.visited = true;
            stack.push(actual);
            this.makePath(actual,next);
            solvebacktracking(next,stack);
          }
          else if(actual.i == tamano-1 && actual.j == tamano-1) {return grid;}
          else{
            actual.path = 0;
            solvebacktracking(stack.pop(), stack);
          }
        }
        revisaVecino(actual.checkWalls(grid , [], tamano));
      }
      solvebacktracking(grid[0], []);
      grid[0].path = 1;
      return grid;
    }
    /**
    * Agrega la celda a la solución
    *@function makePath
    *@param {cell} current - celda actual
    *@param {cell} next - celda vecina
    */
    this.makePath = (current,next) => {current.path = 1; next.path = 1; }
  }
}

let initSolve = (maze,grid) => {
  maze.forEach(element => grid.push(toCell(element)));
  return grid;
}

/**
* Genera un instancia Cell a partir de un objeto paralelo
*@function toCell
*@param {object} object - objeto a ser cambiado a tipo Cell
*@returns {cell} Nueva instancia Cell
*/
let toCell = object => new Cell(object.i, object.j, object.paredes);

/**
* Exporta el objeto MazeGen y SolveGen
* @module Maze
*/

/** Generar laberinto y solución */

module.exports = {
  MazeGen: MazeGen,
  SolveGen: SolveGen
}
