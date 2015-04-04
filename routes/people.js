module.exports = function(app) {
  var mongoose = require('mongoose');
  var Person = mongoose.model('Person');
  var Game = mongoose.model('Game');

  app.get("/people", function(req, res, next){
    Person
      .find()
      .populate('teams requests')
      .exec(function(err, people){
        if(err){return next(err);}

        var opts = {
          path: 'team.league',
          model: 'League',
          select: 'name abbreviation'
        };
        // nested populate
        Person.populate(people, opts, function(err, people){
          if(err){return next(err);}

          res.json(people);
        });
      });
  });

  app.get("/people/:q", function(req, res, next) {
    var query = {};
    if (req.params.q.match(/@/)){
      query = {"email": req.params.q};
    }
    else {
      query = {"_id": req.params.q};
    }     

    Person
      .findOne(query)
      .populate('teams')
      .exec(function(err, person){
        if(err){return next(err);}

        res.json(person);
      });
  });

  app.put("/people/:id/certify/:test", function(req, res, next){
    // multiple steps to use a variable as an object key
    var to_update = {};
    to_update["certifications." + req.params.test] = true;

    Person
      .update({"_id": req.params.id}, to_update)
      .exec(function(err, person){
        if(err){return next(err);}

        if(person.length > 0) {
          res.json({status: 200, message: 'ok'});
        }
        else {
          res.status(404).send('Person not found');
        }
      });
  });

  app.post("/people", function(req, res, next){
    var p = new Person(req.body);

    // console.log(req.body);

    p.save(function(err, pers){
      if(err){return next(err);}

      res.json({status: 201, message: pers._id});
    });
  });

  app.get("/people/:id/games", function(req, res, next){
    Person
      .findOne({"_id": req.params.id})
      .exec(function(err, person){
        if(err){return next(err);}
        if (!person){res.status(404).send('Person not found');}
        Game
          .find({crews: {$in: person.crews}})
          .populate('team_a team_b head_referee snitch')
          .exec(function(err, games){
            if(err){return next(err);}

            res.json({games: games, ref: person});
          });
      });
  });

  app.get('/crews/:id', function(req, res, next){
    // only words for 3 character crews
    var raw = req.params.id.toUpperCase();
    var id = raw.slice(0,2) + raw[2].toLowerCase();
    People
      .find({crews: id})
      .exec(function(err, crew){
        if(err){return next(err);}
        if (!crew){res.status(404).send('Crew not found');}

        res.json({crew: id, people: crew});
      });
  });
};