const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

// load environement variables
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setup routes
// TODO : transer this route to file
app.get('/search', async (req, res) => {
  const query = req.query.q;

  if(!query || query.length === 0)
    return res.json([]);

  // TODO: put token in env var
  const Authorization = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGRjNTU3MmFiYTk4NWZjNDg1OTczZTJkOGY4ODUwZSIsInN1YiI6IjY0YjFmYWZkMzc4MDYyMDBhZDEzZjM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AM186NGcSALAzSrLfm3kAhEvYaEg9wh1sVLeEmfnHGU';
  try {
    let response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}`, { headers: { Authorization } });
    if(response.status !== 200)
      res.sendStatus(500);
  
    response = await response.json();
    
    response = response.results.map(({name, overview, poster_path}) => ({
      name,
      overview,
      posterURL: poster_path
    }));
  
    res.json(response);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const showRoutes = require('./routes/show');
app.use(showRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// setup server
const port = process.env.PORT | 3000;
(async () => {
  try {
    // DB connect
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('successfully connected to database.');

    // app start
    app.listen(port, () => {
      console.log(`server up and running on ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();