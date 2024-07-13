const fs = require('fs');
const { fetchFilmDetails } = require('./fetchFilmDetails');

async function getPage(page, region) {
  const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&region=${region}`;
  const data = await fetchFilmDetails(url);

  return data;
}

async function fetchNowPlaying(nowPlayingPath) {
  let currentPage = 1;
  let region = 'US';

  let data = await getPage(1, region);

  let pages = data['total_pages'];
  let filmResults = data.results;

  if (pages > 1) {
    currentPage++;
    while (currentPage <= pages) {
      const testData = await getPage(currentPage, region);
      currentPage++;
      testData.results.forEach((item) => {
        if (!filmResults.find((film) => film.id === item.id)) {
          filmResults.push(item);
        }
      });
    }
  }

  console.log('Data pull finished');
  console.log(`Current list is ${filmResults.length} items long`);

  const json = JSON.stringify(filmResults);

  fs.appendFile(nowPlayingPath, json, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('file created successfully');
    }
  });

  return filmResults;
}

module.exports = { fetchNowPlaying };
