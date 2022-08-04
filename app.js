const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');
const cloudinary = require('cloudinary').v2;
const indexRoutes = require('./routes/index');
const gardenRoutes = require('./routes/garden');
const plantRoutes = require('./routes/plants');
const profileRoutes = require('./routes/profile');

// Settings
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Connect to DB
connectDB();

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
}));

// Passport Setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

// Routes
app.use('/', indexRoutes);
app.use('/gardens', gardenRoutes);
app.use('/gardens/plants', plantRoutes);
app.use('/profile', profileRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Your server is running on PORT ${process.env.PORT}, you\'d better go catch it!`);
});