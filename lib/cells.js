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

const mutil = require('./util');
const index = mutil.index;

class Cell{
  constructor(i, j, paredes = [true,true,true,true]){
    this.i = i;
    this.j = j;
    this.paredes = paredes; //0->Arriba | 1->Derecha | 2->Abajo | 3-> Izquierda
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
