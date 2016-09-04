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
const mazeGen = mzgen.MazeGen;
const solveGen = mzgen.SolveGen;
const util = require('./lib/util');
const MazeGen = mzgen.MazeGen;
const SolveGen = mzgen.SolveGen;
const promise = util.toPromise;
mongoose.Promise = global.Promise;

//Database

var db;

/*mongodb.MongoClient.connect("mongodb://localhost:27017/mazes", (err, database)=> {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
});*/

mongoose.connect('mongodb://localhost:27017/mazes');

//USERS API ROUTES BELOW

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

router.post('/mazes',(req,res) => {
  console.log('Posting: '+ req.body.id);
  let maze = new Maze(); // New instance of Maze model
  maze.id = req.body.id;
  maze.mazeGen = req.body.mazeGen;
  maze.save().catch(err => console.log(err));
});

router.get('/mazes',(req,res) => {
  Maze.find().exec()
    .then(mazes => res.send(mazes))
    .catch(err => console.log('Error db'));
});
 //-----------maze by id-------------//

 router.get('/mazes/:maze_id',(req,res) => {
   console.log('Getting maze with id: '+ req.params.maze_id);
   Maze.find({id: req.params.maze_id}).exec()
   .then(maze => res.send(maze))
   .catch(err =>  console.log(err))
 });

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});
