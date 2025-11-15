import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import morgan from "morgan";
import apiRoutes from "./api/v1";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// api routes
app.use("/api/v1", apiRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "ui")));

  app.get("/{*any}", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "..", "ui", "index.html"));
  });
}

// setup server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server up and running on ${port}`);
});
