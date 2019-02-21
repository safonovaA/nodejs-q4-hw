export const parseCookie = (req, res, next) => {
  const cookies = req.headers['set-cookie'];
  req.parsedCookies = cookies;
  next();
};
