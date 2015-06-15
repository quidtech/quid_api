var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
  // _id, generated by mongo
  first_name: {type: String, required: true, trim: true},
  last_name: {type: String, required: true, trim: true},

  gender: {type: String, require: true, trim: true},

  // these must be unique
  email: {type: String, required: true, lowercase: true, trim: true},
  
  teams: {type: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}], default: []}
});

mongoose.model('Person', PersonSchema);
