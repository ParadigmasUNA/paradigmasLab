var width, height, blockSize = 25, cells = [], path = [], solutionRight = [], solutionLeft = [];

SVG = {
  createCanvas : function( width, height ){
    var container = document.createElement( 'div' );
    container.classList.add('container');
    document.body.appendChild(container);
    var canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var canvasOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas.setAttribute('version', '1.1');
    canvas.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.setAttribute('viewBox', '0 0 '+width+' '+height);
    canvas.style.backgroundColor = 'black';
    canvasOverlay.setAttribute('version', '1.1');
    canvasOverlay.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    canvasOverlay.setAttribute('width', width);
    canvasOverlay.setAttribute('height', height);
    canvasOverlay.setAttribute('viewBox', '0 0 '+width+' '+height);
    container.appendChild( canvas );
    container.appendChild( canvasOverlay );
    return [canvas,canvasOverlay];
  },
  createLine : function (x1, y1, x2, y2, color, w) {
    var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', color);
    aLine.setAttribute('stroke-width', w);
    aLine.setAttribute('stroke-linecap','square');
    return aLine;
  }
}

/*var lines = [];
lines.addLine = function( line ){
  this.push( line );
  return line;
}*/

function start(type) {
  var canvas = SVG.createCanvas( width * blockSize , height * blockSize );

  for(var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      cells.push({
        x: x,
        y: y,
        visited: (
            (x === 0 || x === width - 1 || y === 0 || y === height-1) &&
            !(x === 1 && y === 0) &&
            !(x === width-2 && y === height-1)
        )
      });
    }
  }

  var start = (Math.floor(Math.random() * 2));
  var startOptions = [
  	height*width - width*2 + 1,
    2*width - 2
  ]

  console.log([cells[height*width - width*2 + 1].x+','+cells[height*width - width*2 + 1].y, cells[2*width - 2].x+','+cells[2*width - 2].y], start);

  visit(startOptions[start], canvas[0]);
}

[].slice.call(document.querySelectorAll('button')).forEach(function(button){
  button.addEventListener('click', function(){
    cells = [], path = [],
    width = Number(document.querySelector('[name=width]').value),
    height = Number(document.querySelector('[name=height]').value);
    var old = document.querySelector('.container');
    if(old) old.parentNode.removeChild(old);
    document.body.classList.remove('finished');
    start(this.value);
  });
});

function visit(i, canvas) {
  // entering a cell
  cells[i].visited = true;

  // basic structure
  var ret = {
    directions: {
      top: cells[i - width],
      right: cells[i + 1],
      bottom: cells[i + width],
      left: cells[i - 1],
    }
  };

  // eliminate edges
  if(cells[i].x + 1 === width) {
    delete ret.directions.right;
  }
  if(cells[i].x === 0) {
    delete ret.directions.left;
  }
  if(cells[i].y + 1 === height) {
    delete ret.directions.bottom;
  }
  if(cells[i].y === 0) {
    delete ret.directions.top;
  }

  // eliminate visited cells
  for(var dir in ret.directions) {
    if (ret.directions[dir].visited === true)
      delete ret.directions[dir];
  }

  // list accesible cells
  var arr = Object.keys(ret.directions);

  // if there's an accessible cell, visit it
  if(arr.length > 0) {
    var next = arr[Math.floor(Math.random() * arr.length)];
    window.requestAnimationFrame(function(){
      var ySrcOffset = 0, yDestOffset = 0;
      if(i === 1 + width && ret.directions[next].y === 0 || ret.directions[next].y === height - 1) {
        yDestOffset = parseInt(blockSize / 2) * (+(ret.directions[next].y !== height - 1) * 2 - 1)
      }
      canvas.appendChild(/*lines.addLine(*/SVG.createLine(
        cells[i].x * blockSize + parseInt(blockSize / 2), cells[i].y * blockSize + parseInt(blockSize / 2) + ySrcOffset,
        ret.directions[next].x * blockSize + parseInt(blockSize / 2), ret.directions[next].y * blockSize + parseInt(blockSize / 2) + yDestOffset,
        'rgb(255,0,0)',
        parseInt(blockSize / 2)
      )/*)*/);
      path.push(i);

      if(ret.directions[next].y === 0) {
        solutionLeft = path.slice();
      }

      if(ret.directions[next].y === height - 1) {
        solutionRight = path.slice();
      }

      visit(cells.indexOf(ret.directions[next]), canvas);
    });
  } else if(path.length > 0) {
    // we don't have a cell we can go to. let's retrace our steps
    var next = path.pop();
    //setTimeout(function(){
      visit(next, canvas);
    //}, 20);
  } else {
    console.log('No hay callback');
  }
}
