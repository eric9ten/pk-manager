require('dotenv').config({ path: './app/config.env' });

const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

let corsOptions = {
  origin: "http://localhost:8081",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "pk-session",
    keys: [ process.env.JWT_SECRET ],
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

// Validate ATLAS_URI
const mongoURI = process.env.ATLAS_URI;
if (!mongoURI || mongoURI.includes('<user>') || mongoURI.includes('<password>')) {
  console.error('Error: ATLAS_URI is missing or contains placeholders. Check ./app/config.env.');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB with URI:', mongoURI.replace(/:([^:@]+)@/, ':****@')); // Mask password

db.mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pitch Keeper Manager." });
});

try {
  console.log('Loading auth routes...');
  app.use('/api/pk-manager', require('./app/routes/auth.routes'));
  console.log('Loading user routes...');
  app.use('/api/pk-manager', require('./app/routes/user.routes'));
  console.log('Loading team routes...');
  app.use('/api/pk-manager', require('./app/routes/team.routes'));
  console.log('Loading game routes...');
  app.use('/api/pk-manager', require('./app/routes/game.routes'));
} catch (err) {
  console.error('Error loading routes:', err);
  process.exit(1);
}

app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    console.log('Checking roles collection...');
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      console.log('Seeding roles...');
      await Role.insertMany([
        { name: 'user' },
        { name: 'admin' },
      ]);
      console.log('Roles seeded successfully');
    } else {
      console.log('Roles already exist, skipping seeding');
    }
  } catch (err) {
    console.error('Error seeding roles:', err);
  }
}