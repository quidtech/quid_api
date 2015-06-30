var mongoose = require('mongoose');

var PersonSchema = new mongoose.Schema({
  // _id, generated by mongo
  first_name: {type: String, required: true, trim: true},
  last_name: {type: String, required: true, trim: true},

  // there's no good way to do this 
  // gender: {type: String, require: true, trim: true},

  // emails can't be unique because it sees all null emails as the same
  email: {type: String, lowercase: true, trim: true, unique: true, sparse: true},

  // date of birth
  // this will never be shown in a response, and is only here to verify uniqueness
  dob: {type: Date, required: true, select: false}, 
  
  teams: {type: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}], default: []}
});

// a person is defined unique by fn + ln + dob
PersonSchema.index({first_name: 1, last_name: 1, dob: 1}, {unique: true, dropDups: true});

mongoose.model('Person', PersonSchema);
