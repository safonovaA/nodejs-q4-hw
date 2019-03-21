import jwt from 'jsonwebtoken';

export default function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'secret', function (err, decoded) {
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ success: false, message: 'No token provided.' });
  }
}