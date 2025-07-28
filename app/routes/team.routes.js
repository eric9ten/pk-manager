const express = require('express');
const router = express.Router({ strict: false });
const teams = require("../controllers/team.controller.js");

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Create a new Team
router.post("/teams", teams.create);
// Delete all Teams
router.delete("/teams", teams.deleteAll);
// Retrieve all Teams
router.get("/teams/all", teams.findAll);
// Retrieve a single Team with id
router.get("/teams/team/:id", teams.findOne);
// Update a Team with id
router.put("/teams/team/:id", teams.update);
// Delete a Team with id
router.delete("/teams/team/:id", teams.delete);
// Retrieve all Teams by owner ID
router.get("/teams/byowner/:ownerId", teams.findAllByOwner);
// Retrieve All Teams by Roles
router.get("/teams/byallroles/:userId", teams.findTeamsByAllRoles);
// Retrieve Teams Digest by owner ID
router.get("/teams/owneddigest/:ownerId", teams.findTeamsOwnedDigest);
// Retrieve Teams Digest by manager ID
router.get("/teams/manageddigest/:managerId", teams.findTeamsManagedDigest);

module.exports = router;