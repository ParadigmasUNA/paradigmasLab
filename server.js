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

/*  "/users"
 *    GET: finds all users
 *    POST: creates a new user
 */
/*
app.get("/users", (req, res) => {
  db.collection(USERS_COLLECTION).find({}).toArray((err, docs) => {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/users", function(req, res) {
  var newUser = req.body;
  newUser.createDate = new Date();

  if (!(req.body.name || req.body.password)) {
    handleError(res, "Invalid user input", "Must provide a name and password.", 400);
  }

  db.collection(USERS_COLLECTION).insertOne(newUser, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

//Finds user by name
/*
 app.get("/users/:name", function(req, res) {
  db.collection(USERS_COLLECTION).findOne({ name: req.params.id }, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to get user");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/users/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(USERS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update user");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/users/:id", function(req, res) {
  db.collection(USERS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete user");
    } else {
      res.status(204).end();
    }
  });
});*/

//-------------------------------------//

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

router.post('/mazes',(req,res) => {
  console.log('Posting: '+ req.body.id);
  let maze = new Maze(); // New instance of Maze model
  maze.id = req.body.id;
  maze.mazeGen = req.body.mazeGen;
  /*maze.save((err) => {
    if(err){
      res.send(err);
      console.log('Post: '+err);
    }
    res.json({message: 'Maze created!', 'mazeID': maze._id});
  });*/
  maze.save().catch(err => console.log(err));
});

router.get('/mazes',(req,res) => {
  /*Maze.find({},(err,mazes) => {
    if(err){
      res.send(err);
      console.log('error db');
    }
    res.send(mazes);
  });*/
  Maze.find().exec()
    .then(mazes => res.send(mazes))
    .catch(err => console.log('Error db'));
});

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});
