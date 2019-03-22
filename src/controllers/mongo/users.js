import jwt from 'jsonwebtoken';
import User from '../../database/mongo/models/user';

const UsersMongoController = {
  getAll(req, res) {
    return User
      .find({}, 'providerId firstName lastName provider _id')
      .then((users) => res.status(200).send(users))
      .catch((err) => res.send(400).send(err));
  },
  create(req, res) {
    return User
      .create(req.body)
      .then((users) => res.status(201).send(users))
      .catch((err) => res.status(400).send(err));
  },
  delete(req, res) {
    const { id } = req.params;
    return User
      .deleteOne({_id: id})
      .then(() => res.status(202).send('Deleted'))
      .catch((err) => res.status(400).send(err));
  },
  authWithProvider(req, res) {
    return User
      .findOneAndUpdate({
        providerId: req.user.providerId,
        provider: req.user.provider,
      }, req.user, {upsert: true})
      .then((user) => res.status(200).send('Hello!'))
      .catch((err) => res.status(400).send(err));
  },
  authWithJWT(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    return User
      .findOne({
        username,
        password,
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

export default UsersMongoController;
