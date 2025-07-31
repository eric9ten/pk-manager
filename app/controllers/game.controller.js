const db = require('../models');
const Game = db.game;

exports.create = (req, res) => {
  console.log('GameController: Creating game', req.body);
  const { gameDate, gameTime } = req.body;

  // Validate gameTime format
  if (!gameTime.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)) {
    console.warn('GameController: Invalid gameTime format', { gameTime });
    return res.status(400).send({ message: 'Invalid gameTime format. Expected HH:mm AM/PM' });
  }

  // Validate gameDate is a valid ISO string
  const parsedDate = new Date(gameDate);
  if (isNaN(parsedDate.getTime())) {
    console.warn('GameController: Invalid gameDate format', { gameDate });
    return res.status(400).send({ message: 'Invalid gameDate format. Expected ISO string' });
  }

  const game = new Game({
    teamA: req.body.teamA,
    teamB: req.body.teamB,
    homeTeam: req.body.homeTeam,
    gameDate: parsedDate,
    gameTime,
    location: req.body.location,
    gameType: req.body.gameType,
    gameTypeName: req.body.gameTypeName,
    teamAStats: req.body.teamAStats || {
      goals: 0,
      passes: 0,
      shots: 0,
      tackles: 0,
      goalKicks: 0,
      cornerKicks: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
    },
    teamBStats: req.body.teamBStats || {
      goals: 0,
      passes: 0,
      shots: 0,
      tackles: 0,
      goalKicks: 0,
      cornerKicks: 0,
      fouls: 0,
      yellowCards: 0,
      redCards: 0,
    },
    owner: req.body.owner,
    scorekeepers: req.body.scorekeepers || [],
  });

  game.save()
    .then(data => {
      console.log('GameController: Game created', { ...data._doc, gameDate: data.gameDate.toISOString() });
      res.status(201).send(data);
    })
    .catch(err => {
      console.error('GameController: Error creating game', err);
      res.status(500).send({
        message: err.message || 'Error creating game',
      });
    });
};

exports.findAll = (req, res) => {
  const owner = req.query.owner;
  console.log('GameController: Fetching games for owner', owner);
  Game.find({ owner })
    .populate('teamA teamB scorekeepers')
    .lean()
    .then(data => {
      console.log('GameController: Raw games data', data);
      const formattedData = data.map(game => ({
        ...game,
        teamAInfo: Array.isArray(game.teamA) ? (game.teamA[0] || null) : game.teamA,
        teamBInfo: Array.isArray(game.teamB) ? (game.teamB[0] || null) : game.teamB,
        teamA: game.teamA && !Array.isArray(game.teamA) ? game.teamA._id : null,
        teamB: game.teamB && !Array.isArray(game.teamB) ? game.teamB._id : null,
      }));
      console.log('GameController: Formatted games data', formattedData);
      res.send(formattedData);
    })
    .catch(err => {
      console.error('GameController: Error retrieving games', err);
      res.status(500).send({
        message: err.message || 'Error retrieving games',
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log('GameController: Fetching game with id', id);
  Game.findById(id)
    .populate('teamA teamB scorekeepers')
    .lean()
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: 'Game not found' });
      }
      console.log('GameController: Raw game data', data);
      const formattedData = {
        ...game,
        teamAInfo: Array.isArray(data.teamA) ? (data.teamA[0] || null) : data.teamA,
        teamBInfo: Array.isArray(data.teamB) ? (data.teamB[0] || null) : data.teamB,
        teamA: data.teamA && !Array.isArray(data.teamA) ? data.teamA._id : null,
        teamB: data.teamB && !Array.isArray(data.teamB) ? data.teamB._id : null,
      };
      console.log('GameController: Formatted game data', formattedData);
      res.send(formattedData);
    })
    .catch(err => {
      console.error('GameController: Error retrieving game', err);
      res.status(500).send({
        message: err.message || 'Error retrieving game',
      });
    });
};

exports.findByOwner = (req, res) => {
  const id = req.params.userId;
  console.log('GameController: Fetching games for user', id);
  Game.find({ owner: id })
    .populate('teamA teamB scorekeepers')
    .lean()
    .then(data => {
      console.log('GameController: Raw games data (by owner)', data);
      const formattedData = data.map(game => ({
        ...game,
        teamAInfo: Array.isArray(game.teamA) ? (game.teamA[0] || null) : game.teamA,
        teamBInfo: Array.isArray(game.teamB) ? (game.teamB[0] || null) : game.teamB,
        teamA: game.teamA && !Array.isArray(game.teamA) ? game.teamA._id : null,
        teamB: game.teamB && !Array.isArray(game.teamB) ? game.teamB._id : null,
      }));
      console.log('GameController: Formatted games data (by owner)', formattedData);
      res.send(formattedData);
    })
    .catch(err => {
      console.error('GameController: Error retrieving games by owner', err);
      res.status(500).send({
        message: err.message || 'Error retrieving games by owner',
      });
    });
};

exports.findByTeam = (req, res) => {
  const teamId = req.params.teamId;
  console.log('GameController: Fetching games for team', teamId);
  Game.find({ $or: [{ teamA: teamId }, { teamB: teamId }] })
    .populate('teamA teamB scorekeepers')
    .lean()
    .then(data => {
      console.log('GameController: Raw games data (by team)', data);
      const formattedData = data.map(game => ({
        ...game,
        teamAInfo: Array.isArray(game.teamA) ? (game.teamA[0] || null) : game.teamA,
        teamBInfo: Array.isArray(game.teamB) ? (game.teamB[0] || null) : game.teamB,
        teamA: game.teamA && !Array.isArray(game.teamA) ? game.teamA._id : null,
        teamB: game.teamB && !Array.isArray(game.teamB) ? game.teamB._id : null,
      }));
      console.log('GameController: Formatted games data (by team)', formattedData);
      res.send(formattedData);
    })
    .catch(err => {
      console.error('GameController: Error retrieving games by team', err);
      res.status(500).send({
        message: err.message || 'Error retrieving games by team',
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  console.log('GameController: Updating game with id', id, 'data', req.body);
  let updateData = { ...req.body };

  // Validate gameTime and gameDate if provided
  if (req.body.gameDate && req.body.gameTime) {
    if (!req.body.gameTime.match(/^\d{1,2}:\d{2}\s?(AM|PM)$/i)) {
      console.warn('GameController: Invalid gameTime format', { gameTime: req.body.gameTime });
      return res.status(400).send({ message: 'Invalid gameTime format. Expected HH:mm AM/PM' });
    }
    const parsedDate = new Date(req.body.gameDate);
    if (isNaN(parsedDate.getTime())) {
      console.warn('GameController: Invalid gameDate format', { gameDate: req.body.gameDate });
      return res.status(400).send({ message: 'Invalid gameDate format. Expected ISO string' });
    }
    updateData.gameDate = parsedDate;
  }

  Game.findByIdAndUpdate(id, updateData, { new: true })
    .populate('teamA teamB scorekeepers')
    .lean()
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: 'Game not found' });
      }
      console.log('GameController: Raw updated game data', data);
      const formattedData = {
        ...data,
        teamAInfo: Array.isArray(data.teamA) ? (data.teamA[0] || null) : data.teamA,
        teamBInfo: Array.isArray(data.teamB) ? (data.teamB[0] || null) : data.teamB,
        teamA: data.teamA && !Array.isArray(data.teamA) ? data.teamA._id : null,
        teamB: data.teamB && !Array.isArray(data.teamB) ? data.teamB._id : null,
      };
      console.log('GameController: Formatted updated game data', formattedData);
      res.send(formattedData);
    })
    .catch(err => {
      console.error('GameController: Error updating game', err);
      res.status(500).send({
        message: err.message || 'Error updating game',
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log('GameController: Deleting game with id', id);
  Game.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: 'Game not found' });
      }
      res.send({ message: 'Game deleted successfully' });
    })
    .catch(err => {
      console.error('GameController: Error deleting game', err);
      res.status(500).send({
        message: err.message || 'Error deleting game',
      });
    });
};

exports.deleteAll = (req, res) => {
  console.log('GameController: Deleting all games');
  Game.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} games deleted successfully` });
    })
    .catch(err => {
      console.error('GameController: Error deleting all games', err);
      res.status(500).send({
        message: err.message || 'Error deleting all games',
      });
    });
};

module.exports = exports;