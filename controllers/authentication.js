const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

module.exports = {
  login: {
    post: async (req, res, next) => {
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
    },
  },
  signup: {
    post: async (req, res, next) => {
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
    },
  },
  password: {
    put: async (req, res, next) => {
      const { currentPassword, newPassword } = req.body;

      if(currentPassword === undefined || newPassword === undefined) {
        res.sendStatus(400);
        return;
      }

      const user = await User.findOne({_id: req.user.id});

      if(!user) {
        res.sendStatus(404);
        return;
      }

      // verify password
      const passwordComparison = await bcrypt.compareSync(
        currentPassword,
        user.password
      );

      if (!passwordComparison) return res.sendStatus(403);

      const hashedPassword = await bcrypt.hashSync(newPassword, saltRounds);
      
      try {
        user.password = hashedPassword;
        user.save();
        res.sendStatus(200);
      } catch(e) {
        res.sendStatus(500);
      }
    }
  }
};
