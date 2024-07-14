require('dotenv').config({ path: '../.env' });

const axios = require('axios');
const fs = require('fs');
const { client, Status, RemixControl, RemixStyle } = require('imaginesdk');
const IMAGINE_AUTH = process.env.IMAGINE_AUTH;

async function downloadImage(url, id) {
  const filepath = `./image_generation/input_posters/${id}.jpg`;

  if (fs.existsSync(filepath)) {
    return filepath;
  }

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });

  return filepath;
}

const generator = async (answers, id, posterPath) => {
  const prompt = `A movie poster that is ${answers[0]} and ${answers[1]} Remake in a ${answers[3]} style.`;
  const imagine = client(IMAGINE_AUTH);

  const rawImagePath = await downloadImage(posterPath, id);
  let outputPath;

  const response = await imagine.remix(
    prompt,

    rawImagePath,

    {
      control: RemixControl.SCRIBBLE,
      style: RemixStyle.IMAGINE_V1,
      aspect_ratio: '3:2',
      strength: 30,
    }
  );

  if (response.status() === Status.OK) {
    const image = response.data();
    const timestamp = Date.now();
    outputPath = `${id}_${timestamp}.png`;

    if (image) image.asFile(`./public/images/${outputPath}`);
  } else {
    console.log(`Status Code: ${response.status()}`);
  }

  return outputPath;
};

async function testFunction() {
  const id = '1022789';
  const prompt =
    'Fun, laughter, in my brain, colourful. Remake in a retro style.';

  const remote_url =
    'http://image.tmdb.org/t/p/w300/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg';

  const outputPath = await generator(prompt, id, remote_url);
  console.log('done');
  console.log(outputPath);
}

module.exports = { generator };
