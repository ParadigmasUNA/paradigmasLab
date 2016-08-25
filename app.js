// modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// db calls
var db;
var USERS_COLLECTION = "users";

mongodb.MongoClient.connect("mongodb://localhost:27017/maze",function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
});

//USERS API ROUTES BELOW

//error handler
handleError = (res, reason, message, code) => {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/users", (req, res) => {
  db.collection(USERS_COLLECTION).find({}).toArray(function(err, docs) {
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

/*  "/contacts/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

 app.get("/users/:id", function(req, res) {
  db.collection(USERS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (err, doc) => {
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
});

//jquery
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
