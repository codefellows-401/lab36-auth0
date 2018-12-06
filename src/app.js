//------------------------------
//* Setup
//------------------------------
'use strict';

// Dependencies
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './auth/router.js';
import auth from './auth/middleware.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';
import auth0 from 'auth0-js';

let app = express();

//------------------------------
//* Auth0 Setup
//------------------------------
// export default class Auth {
//   auth0 = new auth0.WebAuth( {
//     domain: process.env.CLIENT_URL,
//     clientID: 'ZwWUqlwLx2w0LLYgGbbWxVTlgz6NChOC',
//     redirectUri: 'http://localhost:3000/callback',
//     responseType: 'token id_token',
//     scope: 'openid'
//   });

//   login() {
//     this.auth0.authorize();
//   }
// }

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
// app.get('/', auth(), (req, res) => {
//   res.send('We Are In');
// });

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