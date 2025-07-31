const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    abbrev: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    genGroup: {
      type: String,
      required: true,
    },
    colors: {
      home: {
        type: String,
        default: '#000000',
      },
      away: {
        type: String,
        default: '#ffffff',
      },
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    scorekeepers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);