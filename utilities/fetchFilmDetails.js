require('dotenv').config({ path: '../.env' });
const TMDB_AUTH = process.env.TMDB_AUTH;

async function fetchFilmDetails(dest) {
  let data;

  const url = dest;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: TMDB_AUTH,
    },
  };

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => (data = json))
    .catch((err) => console.error('error:' + err));

  return data;
}

module.exports = { fetchFilmDetails };
