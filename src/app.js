//------------------------------
//* Setup
//------------------------------
'use strict';

// Dependencies
import express from 'express';

let app = express();

import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './auth/router.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';
import session from 'express-session';

// session that will save the cookie
var sess = {
  secret: 'CHANGE THIS SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

// magic right here
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//------------------------------
//* Middleware
//------------------------------
// Processing
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // => req.body
app.use(express.urlencoded( { extended: true } )); //req.body => from a form's key/value pairs
app.use(cookieParser());

// Routing
app.use(express.static('./public'));
app.use(authRouter);

// Error Handling
app.use(notFound);
app.use(errorHandler);

//------------------------------
//* Server Operations
//------------------------------
let server = false;

module.exports = {
  start: ( port ) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Server running on port', port);
      });
    } else {
      console.log('Server is already running!');
    }
  },

  stop: () => {
    server.close( () => {
      console.log('Server has been stopped');
    });
  },
};