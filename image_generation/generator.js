require('dotenv').config({ path: '../.env' });

const axios = require('axios');
const fs = require('fs');
const { client, Status, RemixControl, RemixStyle } = require('imaginesdk');
const IMAGINE_AUTH = process.env.IMAGINE_AUTH;

// Helper function to download the movie poster if it's not already
// Needed for the gen AI call
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
  const prompt = `A movie poster that is ${answers[0]} and ${answers[1]} Remake in a ${answers[2]} style.`;
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

module.exports = { generator };
