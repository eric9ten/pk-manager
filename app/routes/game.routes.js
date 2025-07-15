const express = require('express');
const router = express.Router();
const games = require('../controllers/game.controller');

// Create a new Game
router.post("/", games.create);
// Retrieve all Games
router.get("/", games.findAll);
// Retrieve a single Game with id
router.get("/:id", games.findOne);
// Retrieve all Games by owner ID
router.get("/byowner/:owner", games.findAllByOwner);
// Retrieve all Games by team ID
router.get("/byteam/:teamId", games.findAllByTeam);
// Update a Game with id
router.put("/:id", games.update);
// Delete a Game with id
router.delete("/:id", games.delete);
// Delete all Games
router.delete("/", games.deleteAll);
    
module.exports = router;
