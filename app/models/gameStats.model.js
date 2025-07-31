const mongoose = require('mongoose');

const gameStatsSchema = new mongoose.Schema(
    {
        goals: {
            type: Number,
        },
        passes: {
            type: Number,
        },
        shots: {
            type: Number,
        },
        tackles: {
            type: Number,
        },
        corners: {
            type: Number,
        },
        goalKicks: {
            type: Number,
        },
        offsides: {
            type: Number,
        },
        fouls: {
            type: Number,
        },
        yellows: {
            type: Number,
        },
        reds: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GameStats', gameStatsSchema);
