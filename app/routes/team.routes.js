const express = require('express');
const router = express.Router();
const teams = require("../controllers/team.controller.js");

// Create a new Team
router.post("/", teams.create);
// Retrieve all Teams
router.get("/", teams.findAll);
// Retrieve a single Team with id
router.get("/:id", teams.findOne);
// Update a Team with id
router.put("/:id", teams.update);
// Delete a Team with id
router.delete("/:id", teams.delete);
// Delete all Teams
router.delete("/", teams.deleteAll);
// Retrieve all Teams by owner ID
router.get("/byowner/:ownerId", teams.findAllByOwner);
// Retrieve All Teams by Roles
router.get("/byallroles/:userId", teams.findTeamsByAllRoles);
// Retrieve Teams Digest by owner ID
router.get("/owneddigest/:ownerId", teams.findTeamsOwnedDigest);
// Retrieve Teams Digest by manager ID
router.get("/manageddigest/:managerId", teams.findTeamsManagedDigest);

module.exports = router;