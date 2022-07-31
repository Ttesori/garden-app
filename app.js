const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override');
const indexRoutes = require('./routes/index');
const gardenRoutes = require('./routes/garden');

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

// Routes
app.use('/', indexRoutes);
app.use('/gardens', gardenRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Your server is running on PORT ${process.env.PORT}, you\'d better go catch it!`);
});