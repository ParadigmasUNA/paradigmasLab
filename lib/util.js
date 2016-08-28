const cells = require('./cells');
const Cell = cells.Cell;

  //Me dice si el indice esta fuera de los valores de la matriz
  let index = (x,y,tamano) => {
    return  (x < 0 || y < 0 || x > tamano-1 || y > tamano-1) ? -1 : x + y * tamano;
  }

module.exports = {
  index : index
}
