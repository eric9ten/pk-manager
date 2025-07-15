const db = require("../models");
const { ObjectId } = require('mongodb');
const Team = db.team;

// Create and Save a new Team
exports.create = (req, res) => {  
  console.log('Controller Creating team with request body:', req.body);
  // Validate request
    if (!req.body.name) {
      res.status(400).send({ message: "Team name can not be empty!" });
      return;
    }
    if (!req.body.abbrev) {
      res.status(400).send({ message: "Team abbreviation can not be empty!" });
      return;
    }
    if (!req.body.ageGroup) {
      res.status(400).send({ message: "Age group can not be empty!" });
      return;
    }

    // Create a Team
    const team = new Team({
      name: req.body.name,
      abbrev: req.body.abbrev,
      ageGroup: req.body.ageGroup,
      genGroup: req.body.genGroup,
      players: req.body.players,
      owner: req.body.owner,
      managers: req.body.managers,
      scorekeepers: req.body.scorekeepers,
    });

    console.log('Controller Creating team:', team);
    // Save Team in the database
    team
      .save(team)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Team."
        });
      });
  
};

// Retrieve all Teams from the database.
exports.findAll = (req, res) => {  
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  Team.find(condition)
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

// exports.findAll = (req, res) => {
//   Team.find()
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving teams."
//       });
//     });
// };

// Find a single Team with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Team.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Team with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Team with id=" + id });
      });
  
};
// Update a Team by the id in the request
exports.update = (req, res) => {
    if (!req.body.name) {
      res.status(400).send({ message: "Team name can not be empty!" });
      return;
    }
    if (!req.body.abbrev) {
      res.status(400).send({ message: "Abbreviation can not be empty!" });
      return;
    }
    if (!req.body.ageGroup) {
      res.status(400).send({ message: "Age Group can not be empty!" });
      return;
    }
    if (!req.body.genGroup) {
      res.status(400).send({ message: "Gender can not be empty!" });
      return;
    }
    const id = req.params.id;
    Team.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Team with id=${id}. Maybe Team was not found!`
          });
        } else res.send({ message: "Team was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Team with id=" + id
        });
      });
  
};
// Delete a Team with the specified id in the request
exports.delete = (req, res) => {
  //TODO: Need to verify ownership.  Only admins and team owners can delete teams.
  const id = req.params.id;
  Team.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Team with id=${id}. Maybe Team was not found!`
        });
      } else {
        res.send({
          message: "Team was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Team with id=" + id
      });
    });
};
// Delete all Teams from the database.
exports.deleteAll = (req, res) => {
  //TODO: ony available to admins
  Team.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Teams were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all teams."
      });
    });
};

// Find all Teams by owner ID
exports.findAllByOwner = (req, res) => {
  //TODO: Need to account for scorekeepers
  const owner = ObjectId ( req.query.ownerId );
  var condition = { owner : owner}
  Team.find(condition)
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

// Find Teams by All Roles
exports.findTeamsByAllRoles = (req, res) => {
  const user = req.params.userId;
  Team
    .aggregate([
      {
        '$match': {
          '$or': [
            {
              'owner': ObjectId(user),
            }, {
              'managers': ObjectId(user),
            }, {
              'scorekeepers': ObjectId(user),
            }
          ]
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

// Find Teams Digest by owner ID
exports.findTeamsOwnedDigest = (req, res) => {
  const owner = req.params.ownerId;
  Team
    .aggregate([
      {
        '$match': {
          'owner': ObjectId(owner),
        }
      },{
        '$project': {
          '_id': 1, 
          'name': 1, 
          'abbrev': 1, 
          'ageGroup': 2, 
          'genGroup': 1,
          'managers': 1, 
          'player_count': {
            '$cond': {
              'if': {
                '$isArray': '$players'
              }, 
              'then': {
                '$size': '$players'
              }, 
              'else': '0'
            }
          }
        }
      },{
        '$lookup': {
          'from': 'users', 
          'localField': 'managers', 
          'foreignField': '_id', 
          'as': 'managerInfo'
        }
      }
    ])
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving owned teams."
      })
    });
};
// Find Teams Digest by managers ID
exports.findTeamsManagedDigest = (req, res) => {
  const manager = req.params.managerId;
  Team
    .aggregate([
      {
        '$match': {
          'managers': ObjectId(manager),
        }
      },{
        '$project': {
          '_id': 1, 
          'name': 1, 
          'abbrev': 1, 
          'ageGroup': 2, 
          'genGroup': 1, 
          'managers': 1, 
          'player_count': {
            '$cond': {
              'if': {
                '$isArray': '$players'
              }, 
              'then': {
                '$size': '$players'
              }, 
              'else': '0'
            }
          }
        }
      },{
        '$lookup': {
          'from': 'users', 
          'localField': 'managers', 
          'foreignField': '_id', 
          'as': 'managersInfo'
        }
      }
    ])
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving managed teams."
      })
    });
};
