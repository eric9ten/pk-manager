const db = require("../models");
const { ObjectId } = require('mongodb');
const Game = db.game;

// Create and Save a new Game
exports.create = (req, res) => {
    // Validate request
    if (!req.body.teamA) {
        res.status(400).send({ message: "Must select a team!" });
    return;
    }
    if (!req.body.teamB) {
        res.status(400).send({ message: "Must select a second team!" });
    return;
    }
    if (!req.body.owner) {
        res.status(400).send({ message: "Owner can not be empty!" });
    return;
    }
 
    const gameDate = new Date(req.body.gameDate)

    // Create a Game
    const game = new Game({
        teamA: req.body.teamA,
        teamB: req.body.teamB,
        homeTeam: req.body.homeTeam,
        gameDate: gameDate,
        location: req.body.location,
        owner: req.body.owner,
        scorekeepers: req.body.scorekeepers,
    });

    // Save Game in the database
    game
    .save(game)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the Game."
        });
    });
  
};

exports.findAll = (req, res) => {
    Game.find()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving games."
        });
      });
  };

// Find a single Game with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Game.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Game with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Game with id=" + id });
      });
};

// Update a Game by the id in the request
exports.update = (req, res) => {
    if (!req.body.teamA) {
        res.status(400).send({ message: "Must select team A!" });
    return;
    }
    if (!req.body.teamB) {
        res.status(400).send({ message: "Must team B!" });
    return;
    }
    if (!req.body.owner) {
        res.status(400).send({ message: "Owner can not be empty!" });
    return;
    }

    const id = req.params.id;
    Game.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Game with id=${id}. Maybe Game was not found!`
          });
        } else res.send({ message: "Game was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Game with id=" + id
        });
      });
};

// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
    //TODO: Need to verify ownership.  Only admins and game owners can delete games.
  const id = req.params.id;
  Game.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
        });
      } else {
        res.send({
          message: "Game was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Game with id=" + id
      });
    });
};
// Delete all Games from the database.
exports.deleteAll = (req, res) => {
    //TODO: ony available to admins
    Game.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Games were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all games."
        });
      });
};

// Find all published Games
exports.findAllByOwner = (req, res) => {
    //TODO: Need to account for scorekeepers
    const owner = req.params.owner;
    const manager = req.query.manager;
    var condition = ''
    if (owner) {
      if (manager) {
        //console.log ("Owner and manager")
        condition = { $or: [ { owner: owner }, {managers: [ manager ] } ]}
      } else {
        //console.log ("Owner only")
        condition = { owner : owner }
      }
    } else if (manager) {
      //console.log ("Manager only")
      condition = { managers : [ manager ] }
    }
    //var condition = { $or: [ { owner: owner }, {managers: [ manager ] } ] };
    //Game.find(condition).sort({"gameDate": -1})
    Game.aggregate([
      {
        '$lookup': {
          'from': 'teams', 
          'localField': 'teamA', 
          'foreignField': '_id', 
          'as': 'teamAInfo'
        }
      }, {
        '$lookup': {
          'from': 'teams', 
          'localField': 'teamB', 
          'foreignField': '_id', 
          'as': 'teamBInfo'
        }
      }
    ])
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving teams."
        });
      });
  
};

// Find all published Games by Team
exports.findAllByTeam = (req, res) => {
  const teamId = req.params.teamId;
  Game.aggregate([
    {
      '$match': {
        '$or': [
          {
            'teamA': ObjectId(teamId)
          }, {
            'teamB': ObjectId(teamId)
          }
        ]
      }
    },{
      '$lookup': {
        'from': 'teams', 
        'localField': 'teamA', 
        'foreignField': '_id', 
        'as': 'teamAInfo'
      }
    }, {
      '$lookup': {
        'from': 'teams', 
        'localField': 'teamB', 
        'foreignField': '_id', 
        'as': 'teamBInfo'
      }
    }
  ])
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving teams."
    });
  });
};
