const express = require('express');
const app = express();
require('dotenv').config({ path: './config/.env' });
const connectDB = require('./config/db');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Your server is running on PORT ${process.env.PORT}, you\'d better go catch it!`);
});