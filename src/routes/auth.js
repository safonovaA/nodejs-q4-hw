import { Router } from 'express';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
import GoogleStrategy from 'passport-google-oauth20';

import bodyParser from 'body-parser';

import users from '../data/users';
import tokens from '../data/tokens';

const auth = Router();
const FACEBOOK_APP_ID = '410171629738155';
const FACEBOOK_APP_SECRET = '05a7c0dfa530abc5b0f3eb9ecde41574';
const GOOGLE_CLIENT_ID = '1006638581354-4mhmakn7hrr8osdao120t5tgbfqrnkjl.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'wPePSXefiHSxRu_rcUdZ5e6Q';

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
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:8080/api/auth/facebook/callback',
}, (accessToken, refreshToken, profile, cb) => {
  cb(null, profile);
}));

passport.use(new TwitterStrategy({
  consumerKey: 'TWITTER_CONSUMER_KEY',
  consumerSecret: 'TWITTER_CONSUMER_SECRET',
  callbackURL: 'http://localhost:8080/api/auth/twitter/callback',
}, (token, tokenSecret, profile, cb) => {
  cb(null, profile);
}));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/api/auth/google/callback"
}, (token, tokenSecret, profile, cb) => {
  cb(null, profile);
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
  passport.authenticate('facebook', {session: false}),
  (req, res) => {
    const userName = req.user.displayName;
    res.status(200).send(`<h1>Hello, ${userName}!</h1>`);
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
  passport.authenticate('google', {scope: ['profile']}));

auth.get('/google/callback', 
  passport.authenticate('google', {session: false}),
  (req, res) => {
    const userName = req.user.displayName;
    res.status(200).send(`<h1>Hello, ${userName}!</h1>`);
  }
);

export default auth;
