class TheMaze{
  constructor(){
    this.maze = [];
    this.solutionMaze = [];
    this.anchoCelda = 0;
    this.remote = true;
    this.initCanvas = (tamano,canvasName) => setCanvasSize(tamano,canvasName,this.anchoCelda); //Setea dimnesiones del canvas
    this.worker = undefined;
  }
}
