import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const User = require('../database/models').User;

module.exports = {
  getAll(req, res) {
    return User
      .findAll({attributes: ['providerId', 'firstName', 'lastName', 'provider']})
      .then((users) => res.status(200).send(users))
      .catch((err) => res.send(400).send(err));
  },
  authWithProvider(req, res) {
    return User
      .findOrCreate({
        where: {
          providerId: req.user.providerId,
          provider: req.user.provider,
        },
        defaults: req.user,
      })
      .then((user) => res.status(200).send('Hello!'))
      .catch((err) => res.status(400).send(err));
  },
  authWithJWT(req, res) {
    const username = req.body.username;
    const password = crypto.createHash('sha1').update(req.body.password).digest('hex');

    return User
      .findOne({
        where: {
          username,
          password,
        }
      })
      .then((user) => {
        if (user) {
          const payload = {
            "user": {
              "email": user.email,
              "username": user.username,
            }
          };
          const token = jwt.sign(payload, 'secret', { expiresIn: "1h" });
          res.send(token);
        } else {
          res.status(404).send('User not found');
        }
      })
      .catch((err) => res.status(400).send(err));
  },
};