import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const User = require('../database/models').User;

module.exports = {
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