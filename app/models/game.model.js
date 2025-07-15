const mongoose = require("mongoose");

const Game = mongoose.model(
  "game",
  new mongoose.Schema({
    teamA: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team',
        required: true
    },
    teamB: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team',
        required: true
    },
    homeTeam: {
        type: String,
    },
    gameDate: {
        type: Date,
    },
    location: {
        type: String,
    },
    owner:  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    scorekeeper:  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
  },
  { timestamps: true }
));

module.exports = Game;