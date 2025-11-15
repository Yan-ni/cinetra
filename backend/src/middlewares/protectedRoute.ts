import { Request, Response, NextFunction } from "express";
import { securityModule } from '../modules/security';

declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      user: User;
    }
  }
}

export function protectedRoute(req: Request, res: Response, next: NextFunction): undefined {
  const Authorization = req.get("Authorization");

  if (!Authorization || !Authorization.includes(" ")) {
    res.sendStatus(401);
    return;
  }

  const token = Authorization.split(" ")[1];

  const tokenVerified = securityModule.Commands.VerifyTokenCommand.execute(token);

  if (!tokenVerified) {
    res.sendStatus(401);
    return;
  }

  req.user = { id: tokenVerified.sub };

  next();
};
