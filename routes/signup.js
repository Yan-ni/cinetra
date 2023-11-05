const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  //todo: validate username and password

  try {
    // hash password
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);

    // add to DB
    const user = await User.create({ username, password: hashedPassword });

    // generate token
    const userSigned = await jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    res.status(201).json(userSigned);
  } catch (error) {
    res.sendStatus(500);
  }
});

module.exports = router;
