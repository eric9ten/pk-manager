const express = require('express');
const router = express.Router();
const games = require('../controllers/game.controller');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Create a new Game
router.post('/games', games.create);
// Retrieve all Games
router.get('/games', games.findAll);
// Retrieve a single Game with id
router.get('/games/:id', games.findOne);
// Retrieve all Games by owner ID
router.get('/games/byowner/:userId', games.findByOwner);
// Retrieve all Games by team ID
router.get('/games/byteam/:teamId', games.findByTeam);
// Update a Game with id
router.put('/games/:id', games.update);
// Delete a Game with id
router.delete('/games/:id', games.delete);
// Delete all Games
router.delete('/games', games.deleteAll);

module.exports = router;
