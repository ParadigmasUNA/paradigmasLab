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

class TheMaze{
  constructor(){
    this.maze = [];
    this.solutionMaze = [];
    this.anchoCelda = 0;
    this.remote = true;
    this.worker = undefined;
    this.tamano = 0;
    this.cursor = undefined;
    }
}

class Cursor{
  constructor(){
    this.ActualX = 0;
    this.ActualY= 0;
    this.AnteriorX = 0;
    this.AnteriorY = 0;
    this.ImgCursor =new Image();
    this.fondo = new Image();
    this.rastro= new Image();
  }
}
