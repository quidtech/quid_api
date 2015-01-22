var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
  // _id, generated by mongo
  name: String,
  email: String,
  created: Date,
  certifications: {
    ar: Boolean,
    sr: Boolean,
    hr_written: Boolean,
    hr_field: Boolean,
    td: Boolean
  },
  league: {type: mongoose.Schema.Types.ObjectId, ref: "League"},
  team: {type: mongoose.Schema.Types.ObjectId, ref: "Team"},
  etc: Object
});

mongoose.model('Person', PersonSchema);