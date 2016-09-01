var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./user');

var MazeSchema = new Schema({
  mazeGen: String,
  solution: String
/*user: {type: Schema.Types.ObjectID, ref: 'User'}*/
})

module.exports = mongoose.model('Maze', MazeSchema);
