var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MazeSchema = new Schema({
  mazeGen: Object,
  id: {type: String, index: {unique: true}}
})

module.exports = mongoose.model('Maze', MazeSchema);
