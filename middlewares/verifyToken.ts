import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface RequestUser {
  id: string
}

declare global {
  namespace Express {
    interface Request {
      user: RequestUser
    }
  }
}

export default function (req: Request, res: Response, next: NextFunction): undefined {
  const Authorization = req.get("Authorization");

  if (!Authorization) {
    res.sendStatus(401);
    return;
  }

  const token = Authorization.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "secret";
  const tokenVerified = jwt.verify(token, jwtSecret);

  if (!tokenVerified) {
    res.sendStatus(401);
    return;
  }

  req.user = jwt.decode(token) as RequestUser;
  next();
};
