import { Router } from 'express';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
import GoogleStrategy from 'passport-google-oauth1';

import bodyParser from 'body-parser';

import users from '../data/users';
import tokens from '../data/tokens';

const auth = Router();

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}, (username, password, done) => {
  const user = users.find((user) => user.username === username);
  if (user && user.password !== password) {
    done(null, false, 'Bad username/password combination');
  } else {
    done(null, user);
  }
}));

passport.use(new FacebookStrategy({
  clientID: 'FACEBOOK_APP_ID',
  clientSecret: 'FACEBOOK_APP_SECRET',
  callbackURL: 'http://localhost:8080/auth/facebook/callback',
}, (accessToken, refreshToken, profile, cb) => {
  const user = users.find((user) => user.username === username);
  cb(user);
}));

passport.use(new TwitterStrategy({
  consumerKey: 'TWITTER_CONSUMER_KEY',
  consumerSecret: 'TWITTER_CONSUMER_SECRET',
  callbackURL: 'http://localhost:8080/auth/twitter/callback',
}, (token, tokenSecret, profile, cb) => {
  const user = users.find((user) => user.username === username);
  cb(user);
}));

passport.use(new GoogleStrategy({
  consumerKey: 'www.example.com',
  consumerSecret: 'GOOGLE_CONSUMER_SECRET',
  callbackURL: "http://localhost:8080/auth/google/callback"
}, (token, tokenSecret, profile, cb) => {
  const user = users.find((user) => user.username === username);
  cb(user);
}));

auth.use(bodyParser.json());
auth.use(passport.initialize());

auth.post('/', passport.authenticate('local', { session: false }), (req, res) => {
  const token = tokens.find((token) => token.id === req.user.id);
  res.json(token);
});

auth.get('/facebook', passport.authenticate('facebook'));

auth.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.send('Success');
  }
);

auth.get('/twitter', passport.authenticate('twitter'));

auth.get(
  '/twitter/callback',
  passport.authenticate('twitter'),
  (req, res) => {
    res.send('Success');
  }
);

auth.get('/google',
  passport.authenticate('google'));

auth.get('/google/callback', 
  passport.authenticate('google'),
  (req, res) => {
    res.send('Success');
  }
);

export default auth;
