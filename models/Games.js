var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // _id, generated by mongo
  team_a: {type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true},
  team_b: {type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true},

  // scores not required so that we can use these to schedule
  team_a_score: {type: Number, default: 0},
  team_b_score: {type: Number, default: 0},

  // who caught it when
  rt_snitch: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},
  ot_snitch: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},
  sd_snitch: {type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null},

  // game time, in seconds
  duration: Number,

  // higher is harder
  level: {type: Number, min: 1, max: 4, default: null},

  // tournament info, 0 indexed (will display everything + 1)
  timeslot: {type: Number, default: null},
  pitch: {type: Number, default: null},
  
  // these should be required. Maybe a validate game route to double check this stuff? or confirm?
  head_referee: {type: mongoose.Schema.Types.ObjectId, ref: "Person", default: null},
  snitch: {type: mongoose.Schema.Types.ObjectId, ref: "Person", default: null},

  snitch_referee: {type: mongoose.Schema.Types.ObjectId, ref: "Person"},
  assistant_referee_a: {type: mongoose.Schema.Types.ObjectId, ref: "Person"},
  assistant_referee_b: {type: mongoose.Schema.Types.ObjectId, ref: "Person"},

  // assigned teams
  scorekeepers: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
  goal_refs: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},

  forfeit: {type: Boolean, default: false},
});

mongoose.model('Game', GameSchema);