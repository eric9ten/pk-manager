const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: false,
    },
    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: false,
    },
    homeTeam: {
      type: String,
      required: true,
    },
    gameDate: {
      type: Date,
      required: true,
    },
    gameType: {
      type: String,
    },
    gameTypeDescription: {
      type: String,
    },
    location: {
      type: String,
    },
    teamAStats: {
      goals: { type: Number, default: 0 },
      passes: { type: Number, default: 0 },
      shots: { type: Number, default: 0 },
      tackles: { type: Number, default: 0 },
      goalKicks: { type: Number, default: 0 },
      cornerKicks: { type: Number, default: 0 },
      fouls: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },
    teamBStats: {
      goals: { type: Number, default: 0 },
      passes: { type: Number, default: 0 },
      shots: { type: Number, default: 0 },
      tackles: { type: Number, default: 0 },
      goalKicks: { type: Number, default: 0 },
      cornerKicks: { type: Number, default: 0 },
      fouls: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scorekeepers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);