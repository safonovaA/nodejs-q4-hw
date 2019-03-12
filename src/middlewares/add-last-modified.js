export default function addLastModified(req, res, next) {
  req.body.lastModifiedAt = new Date();
  next();
}
