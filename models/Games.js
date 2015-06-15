var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // _id, generated by mongo
  teams: {type: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}], required: true},

  // scores not required so that we can use these to schedule
  points: {type: [Number], default: [0,0]},

  snitch_snatches: {type: [mongoose.Schema.Types.ObjectId], ref: "Team", default: [null, null, null]},

  // number of overtimes
  overtimes: {type: Number, default: 0, min: 0, max: 2},

  // game time, in seconds
  // if this is 0, the game is incomplete
  duration: {type: Number, default: 0},

  head_referee: {type: mongoose.Schema.Types.ObjectId, ref: "Person", default: null},
  snitch: {type: mongoose.Schema.Types.ObjectId, ref: "Person", default: null},

  forfeit: {type: Boolean, default: false},

  // any other notes about issues or things that wouldn't be apparent in the record
  notes: {type: String, default: null}
});

mongoose.model('Game', GameSchema);