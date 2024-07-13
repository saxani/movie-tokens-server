const express = require('express');
const fs = require('fs');
const cors = require('cors');

const { fetchFilmDetails } = require('./utilities/fetchFilmDetails');
const { fetchNowPlaying } = require('./utilities/fetchNowPlaying');

const port = process.env.PORT || 4000;
const app = new express();

let filmResults;
let posterURL;

const nowPlayingPath = './now_playing/nowplaying.json';

const readFile = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, (err, data) => {
      if (err) reject(err);

      resolve(data);
    })
  );

async function getMovieDetails(id) {
  let showtimes = null;
  const detailsURL = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  const movieDetails = await fetchFilmDetails(detailsURL);

  const ratingURL = `https://api.themoviedb.org/3/movie/${id}/release_dates`;
  const ratingsInfo = await fetchFilmDetails(ratingURL);

  // Parse US rating
  const usInfo = ratingsInfo.results.find(
    (country) => country['iso_3166_1'] === 'US'
  );

  //Append to movie details
  movieDetails.certification = usInfo.release_dates[0].certification;

  // See if showtimes for film exist and save/return them
  const movieNamePath = `./showtimes/${movieDetails.id}.json`;

  if (fs.existsSync(movieNamePath)) {
    console.log(`The file or directory at '${movieNamePath}' exists.`);
    const data = await readFile(movieNamePath);
    const json = JSON.parse(data);
    showtimes = json.showtimes;
  } else {
    console.log(`The file or directory at '${movieNamePath}' does not exist.`);
  }
  return [movieDetails, showtimes];
}

async function getDbConfig() {
  // Config data for how the API structures paths
  // Not hardcoding this incase it changes
  const url = 'https://api.themoviedb.org/3/configuration';
  const config = await fetchFilmDetails(url);

  posterURL = config.images.secure_base_url + config.images.backdrop_sizes[0];
}

if (fs.existsSync(nowPlayingPath)) {
  console.log(`The file or directory at '${nowPlayingPath}' exists.`);
  fs.readFile(nowPlayingPath, (err, data) => {
    filmResults = JSON.parse(data);
    console.log('Film Results has ' + filmResults.length + ' entries.');
  });
} else {
  console.log(`The file or directory at '${nowPlayingPath}' does not exist.`);
  filmResults = fetchNowPlaying(nowPlayingPath);
}

getDbConfig();

app.use(cors());
app.use(express.json());

app.get('/now-playing', (req, res) => {
  res.send(filmResults);
});

app.get('/poster-url', (req, res) => {
  res.send({ poster: posterURL });
});

app.post('/movie-details', async (req, res) => {
  const [movieDetails, showtimes] = await getMovieDetails(req.body.id);

  res.send([movieDetails, showtimes]);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
