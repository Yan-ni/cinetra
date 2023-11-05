const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // verify username
    const dbRes = await User.findOne({ username });
    if (dbRes === null) return res.sendStatus(404);

    // verify password
    const passwordComparison = await bcrypt.compareSync(
      password,
      dbRes.password
    );

    if (!passwordComparison) return res.sendStatus(400);

    const userSigned = await jwt.sign(
      { id: dbRes._id, username },
      process.env.JWT_SECRET
    );

    res.json(userSigned);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
