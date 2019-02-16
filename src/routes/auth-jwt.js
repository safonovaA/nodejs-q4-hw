import { Router } from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import users from '../data/users';

const authJWT = Router();

authJWT.use(bodyParser.json());
authJWT.post('/', (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  const user = users.find((user) => (user.username === userName));
  const validUser = user && users.find((user) => (user.username === userName) && (user.password === password));
  if (user && validUser) {
    const payload = {
      "user": {
        "email": validUser.email,
        "username": validUser.username,
      }
    };
    const token = jwt.sign(payload, 'secret', { expiresIn: "1h" });
    res.send(token);
  } else {
    foundUser ?
    res.status(403).send('Invalid credentials') :
    res.status(404).send('User not found');
  }
});

export default authJWT;
