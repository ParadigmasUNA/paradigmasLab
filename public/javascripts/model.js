class TheMaze{
  constructor(){
    this.maze = [];
    this.solutionMaze = [];
    this.anchoCelda = 0;
    this.remote = true;
    this.worker = undefined;
    this.tamano = 0;
    this.cursor = new Cursor();
//    this.rastro = new Imagen();
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
  this.rastro= '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
  }
}
