import url from 'url';
import querystring from 'querystring';

export const parseQuery = (req, res, next) => {
  const query = url.parse(req.url).query;
  const params = querystring.parse(query);
  req.parsedQuery = { query, params };
  next();
}