// let's test stuff
// eventually this should always test on a test DB
// var url = require('../config/db');
var mongoose = require('mongoose');
var request = require('supertest');
var assert = require('assert');
var rand_id = require('../config/id.js');
var rand_int = require('../config/rand.js');

// starts the server
var server = require('../server');

describe('Routes', function(){
  // this is accessible all through this function
  // TODO: update for test server
  var ids = {
    league: '5589092f534716a974c3789f',
    team: '558a5b252fda6b44c0279bc6',
    game: '558b938ff48494b8eeb3293f',
    person: '559247c27d1a101cbf1e0c71'
  };
  var app;
  before(function() {
    // In our tests we use the test db
    app = server();
  });

  after(function(){
    app.close();
  });

  // could have issues with tests if the port on travis changes
  var url = 'http://localhost:1337';

  describe('Games', function(){
    it('should get all games', function(done){
      request(url)
        .get('/games')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a game', function(done){
      request(url)
        .get('/games/' + ids.game)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);
          assert(res.body.teams[0]._id);

          done();
        });
    });

    // Test PUT? 

    it('should create a new game', function(done){
      var g = {teams: [ids.team, ids.team]};
      request(url)
        .post('/games?api_key=' + process.env.API_KEY)
        .send(g)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);
          done();
        });
    });

    it('should validate a game', function(done){
      // this is basically everything that can go wrong with a game
      var g = {
        scores: [6, 12], 
        teams: [ids.team, ids.team, ids.team], 
        snitch_snatches: [ids.team, ids.team, ids.team, ids.team], 
        overtimes: 3
      };
      request(url)
        .post('/games?api_key=' + process.env.API_KEY)
        .send(g)
        .expect(400)
        .end(function(err, res){
          if (err) { throw err; }
          var j = JSON.parse(res.error.text);
          assert(j.error.length === 4);
          done();
        });
    });
  });

  describe('Leagues', function(){
    it('should get all leagues', function(done){
      request(url)
        .get('/leagues')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a league', function(done){
      request(url)
        .get('/leagues/' + ids.league)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);

          done();
        });
    });

    it('should not get a bogus league', function(done){
      request(url)
        .get('/leagues/badid')
        .expect(500, done);
    });

    it('should get teams for a league', function(done){
      request(url)
        .get('/leagues/' + ids.league + '/teams')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.teams.length > 0);

          done();
        });
    });

    it('should create a new league', function(done){
      var l = {name: 'Test League', code: rand_id()};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(l)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);
          done();
        });
    });

    it('should validate leagues', function(done){
      var l = {name: 'Test League', code: 'BadID'};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(l)
        .expect(400, done);
    });
  });

  describe('People', function(){
    it('should get all people', function(done){
      request(url)
        .get('/people')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a person', function(done){
      request(url)
        .get('/people/' + ids.person)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);
          assert(res.body.teams[0]._id);

          done();
        });
    });

    it('should create a new person', function(done){
      var p = {
        first_name: "Malcolm",
        last_name: "Reynolds",
        dob: rand_int(2050, 9999) + "-09-20",
        email: "mal_" + rand_id() + "@serentiy.com",
        teams: [ids.team]
      };
      request(url)
        .post('/people?api_key=' + process.env.API_KEY)
        .send(p)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id);
          done();
        });
    });

    it('should validate a person', function(done){
      // this is basically everything that can go wrong with a person
      var p = {};
      request(url)
        .post('/people?api_key=' + process.env.API_KEY)
        .send(p)
        .expect(400)
        .end(function(err, res){
          if (err) { throw err; }
          var j = JSON.parse(res.error.text);
          assert(j.error.length === 3);
          done();
        });
    });
  });

  describe('Teams', function(){
    it('should get all teams', function(done){
      request(url)
        .get('/teams')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a team', function(done){
      request(url)
        .get('/teams/' + ids.team)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }
          assert(res.body._id);
          assert(res.body.league.name);

          done();
        });
    });

    it('should create a new team', function(done){
      var t = {
        name: "Michigan Quidditch",
        short_name: rand_id(),
        league: ids.league
      };
      request(url)
        .post('/teams?api_key=' + process.env.API_KEY)
        .send(t)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }
          assert(res.body._id);
          done();
        });
    });

    it('should validate a team', function(done){
      // this is basically everything that can go wrong with a person
      var t = { short_name: "MICHQ" };
      request(url)
        .post('/teams?api_key=' + process.env.API_KEY)
        .send(t)
        .expect(400)
        .end(function(err, res){
          if (err) { throw err; }
          var j = JSON.parse(res.error.text);
          assert(j.error.length === 2);
          done();
        });
    });
  });

});