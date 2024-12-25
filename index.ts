import express, {Request, Response} from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";

const app = express();

// load environment variables
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// setup routes
import {
  authenticationRouter,
  searchRouter,
  showRouter,
  movieRouter,
} from "./routes";

app.use(authenticationRouter);
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
(async () => {
  try {
    // DB connect
    const databaseURI = process.env.DB_CONNECTION_STRING;
    if (databaseURI === undefined) {
      throw new Error('A database connection string must be provided.');
    }
    await mongoose.connect(databaseURI, {
      authSource: "admin"
    });
    console.log("successfully connected to database.");

    // app start
    app.listen(port, () => {
      console.log(`server up and running on ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
