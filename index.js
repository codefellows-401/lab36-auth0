//------------------------------
//* Setup
//------------------------------
'use strict';
console.clear();

// Dependencies
require('dotenv').config();
require('babel-register');
require('babel-polyfill');

//------------------------------
//* Initiate Servers
//------------------------------
// Start DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start Web Server
require('./src/app.js').start(process.env.PORT);