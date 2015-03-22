var mongoose = require('mongoose');

var LeagueSchema = new mongoose.Schema({
  // _id, generated by mongo

  // United States Quidditch
  name: {type: String, required: true}, 

  // ISO 3 letter country code
  code: {type: String, required: true}, 

  // USQ, AQA, etc
  abbreviation: String, 
});

mongoose.model('League', LeagueSchema);