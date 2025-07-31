const mongoose = require('mongoose');

const Role = require('./role.model');
const User = require('./user.model');
const Team = require('./team.model');
const GameStats = require('./gameStats.model');
const Game = require('./game.model');

module.exports = {
  mongoose,
  role: Role,
  user: User,
  team: Team,
  gameStats: GameStats,
  game: Game,
};