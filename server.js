var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
let methodOverride = require('method-override');
const mzgen = require('./lib/maze');
const mazeGen = mzgen.MazeGen;
const solveGen = mzgen.SolveGen;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

router.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

router.post('/', (req,res) => {
   if(req.body.opcion=='1'){
     let caca = new mazeGen();
     let c = caca.init(parseInt(req.body.tamano));
     res.setHeader('Content-Type', 'application/json');
     res.json(JSON.stringify(c));
   }
   else if(req.body.opcion =='2'){
     let caca = new solveGen();
     let c = caca.init(req.body.tamano, req.body.maze);
     res.setHeader('Content-Type','application/json');
     res.json(JSON.stringify(c));
   }
   else{
    console.log('no vino con nada');
   }

});

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});
