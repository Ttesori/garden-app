const express = require('express');
const app = express();
require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index');

// Settings
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Session Setup

// Passport Setup

// Routes
app.use('/', indexRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Your server is running on PORT ${process.env.PORT}, you\'d better go catch it!`);
});