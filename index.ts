import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import morgan from "morgan";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// setup routes
import {
  searchRouter,
  showRouter,
  movieRouter,
} from "./routes";

import authenticationRouter from "./src/authentication/router";
import userRouter from "./src/user/router";
import { protectedRoute } from "./src/middlewares/protectedRoute";

app.use("/api/auth", authenticationRouter);
app.use("/api/user", protectedRoute, userRouter);
app.use(searchRouter);
app.use(showRouter);
app.use(movieRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

// setup server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server up and running on ${port}`);
});
