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

/**
* Módulo de índice y promesificación para celdas
* Requiere el módulo {@link cell.js}
* @requires cells.js
*/

const cells = require('./cells');
const Cell = cells.Cell;

  /**
  * Indica si el indice está fuera de los valores de la matriz
  *@function index
  *@param {number} x - posición x
  *@param {number} y - posición y
  *@param {number} tamano - ancho de celda
  *@returns {boolean} retorna valor donde se va a encontrar dentro de los valores de la matriz, retorna -1 si no está dentro de los valores de la matriz
  */
  let index = (x,y,tamano) => {
    return  (x < 0 || y < 0 || x > tamano-1 || y > tamano-1) ? -1 : x + y * tamano;
  }

  let toPromise = thing => Promise.resolve(thing);

  /**
  * Exporta los métodos de indexación y promesificación
  * @module Util
  */

  /** Indexación y promesificación */

module.exports = {
  index : index,
  toPromise: toPromise
}
