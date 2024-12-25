import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

export default {
  login: {
    post: async (req: Request, res: Response, next: NextFunction) => {
      const { username, password } = req.body;

      try {
        // verify username
        const dbRes = await User.findOne({ username });
        if (dbRes === null) {
          res.sendStatus(404);
          return;
        }

        // verify password
        const passwordComparison = await bcrypt.compareSync(
          password,
          dbRes.password
        );

        if (!passwordComparison) {
          res.sendStatus(400);
          return;
        }

        const userSigned = await jwt.sign(
          { id: dbRes._id, username },
          process.env.JWT_SECRET || "secret"
        );

        res.json(userSigned);
      } catch (error) {
        res.sendStatus(500);
      }
    },
  },
  signup: {
    post: async (req: Request, res: Response, next: NextFunction) => {
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
          process.env.JWT_SECRET || "secret"
        );

        res.status(201).json(userSigned);
      } catch (error) {
        res.sendStatus(500);
      }
    },
  },
  password: {
    put: async (req: Request, res: Response, next: NextFunction) => {
      const { currentPassword, newPassword } = req.body;

      if(currentPassword === undefined || newPassword === undefined) {
        res.sendStatus(400);
        return;
      }

      const user = await User.findOne({_id: req.user?.id});

      if(!user) {
        res.sendStatus(404);
        return;
      }

      // verify password
      const passwordComparison = await bcrypt.compareSync(
        currentPassword,
        user.password
      );

      if (!passwordComparison) {
        res.sendStatus(403);
        return;
      }

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
