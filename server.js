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

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
let methodOverride = require('method-override');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var mongoose = require('mongoose');
let Maze = require('./models/maze');
const mzgen = require('./lib/maze');
const util = require('./lib/util');
const MazeGen = mzgen.MazeGen;
const SolveGen = mzgen.SolveGen;
const promise = util.toPromise;
mongoose.Promise = global.Promise;

//Database

var db;

mongoose.connect('mongodb://localhost:27017/mazes');

//error handler
handleError = (res, reason, message, code) => {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));
app.use(router);


router.get('/', (req, res) => res.sendFile('view/index.html'));

router.post('/genMaze', (req,res) => promise(req).then( _ => res.setHeader('Content-Type', 'application/json'))
                                                 .then( _ => new MazeGen())
                                                 .then(maze => maze.init(parseInt(req.body.tamano)))
                                                 .then(maze => res.json(JSON.stringify(maze)))
                                                 .catch(error => console.log(error)) );

router.post('/solveMaze', (req,res) => promise(req).then( _ => res.setHeader('Content-Type', 'application/json'))
                                                   .then( _ => new SolveGen())
                                                   .then(mazeSolve => mazeSolve.init(parseInt(req.body.tamano), req.body.maze))
                                                   .then(mazeSolve => res.json(JSON.stringify(mazeSolve)))
                                                   .catch(error => console.log(error)) );

router.post('/saveMaze', (req,res) => promise(req).then( _ => new Maze())
                                                  .then( maze => {maze.maze = req.body.maze; return maze;})
                                                  .then(maze => {maze.save(); return new Maze();})
                                                  .then(_ => res.send('asdnasd'))
                                                  .catch(error => console.log(error))
);

router.get('/:id', (req,res) => Maze.find({id: req.params.id}).exec()
                                                              .then(maze => res.send(maze))
                                                              .catch(error =>  console.log(error))
);

router.get('/getmazes', (req,res) => Maze.find().exec().then(_ => console.log('ansdnasdnsa'))
                                                .then(mazes => {console.log(mazes); return mazes})
                                                         .then(mazes => res.send(mazes))
                                                         .then( _ => console.log('Maazees'))
                                                         .catch(err => console.log(err))
);

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});
