//------------------------------
//* Setup
//------------------------------
'use strict';

// Dependencies
import express from 'express';
const authRouter = express.Router();

import User from './model.js';
import passport from 'passport';

//------------------------------
//* Routes
//------------------------------
authRouter.get('/', (req, res, next) => {
  res.render('../public/index.html');
});

// Perform the login, after login Auth0 will redirect to callback

authRouter.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/logged-in');
})

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
authRouter.get('/oauth', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, async (err) => {
      if (err) { return next(err); }

      // store the user in the db
      let actualRealUser = await User.createFromOAuth(user);

      // get the token
      let token = await actualRealUser.generateToken();

      //I don't know what going on with these two lines
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;

      //send the token to the client
      res.send(token);
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default authRouter;
