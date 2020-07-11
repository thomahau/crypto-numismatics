'use strict';
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const fetch = require('node-fetch');
const { PORT, DATABASE_URL, NOMICS_API_KEY } = require('./config');
const { localStrategy, jwtStrategy } = require('./auth');

const app = express();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common'));
// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

const { router: usersRouter } = require('./routes/users');
const { router: authRouter } = require('./routes/auth');
const { router: holdingsRouter } = require('./routes/holdings');

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/holdings', holdingsRouter);

app.use('/tickers/:currency', (req, res) => {
  fetch(`https://api.nomics.com/v1/currencies/ticker?key=${NOMICS_API_KEY}&convert=${req.params.currency}`).then(_res => {
    if (_res.ok) {
      const data = _res.json();
      return res.status(200).json(data);
    }
    throw new Error(_res);
    // throw new Error('Network response was not ok.');
  })
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
