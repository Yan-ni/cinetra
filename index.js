const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");

const app = express();

// load environement variables
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// setup routes
const loginRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const searchRoute = require("./routes/search");
const showRoutes = require("./routes/show");
const movieRoutes = require("./routes/movie");

app.use(loginRoutes);
app.use(signupRoutes);
app.use(searchRoute);
app.use(showRoutes);
app.use(movieRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// setup server
const port = process.env.PORT | 3000;
(async () => {
  try {
    // DB connect
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("successfully connected to database.");

    // app start
    app.listen(port, () => {
      console.log(`server up and running on ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
