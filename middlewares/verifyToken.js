const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const Authorization = req.get("Authorization");

  if (!Authorization) return res.sendStatus(401);

  const token = Authorization.split(" ")[1];
  const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

  if (!tokenVerified) return res.sendStatus(401);

  req.user = jwt.decode(token);
  next();
};
