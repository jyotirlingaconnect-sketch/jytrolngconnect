const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { name: 'mahakaleshwar.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/1280px-Mahakaleshwar_Temple%2C_Ujjain.jpg' },
  { name: 'kal-bhairav.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kal_Bhairav_temple_Ujjain.jpg/1280px-Kal_Bhairav_temple_Ujjain.jpg' },
  { name: 'maheshwar.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Maheshwar_fort.JPG/1280px-Maheshwar_fort.JPG' },
  { name: 'mandu.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/JahazMahal.jpg/1280px-JahazMahal.jpg' },
  { name: 'khajrana.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Khajrana_Ganesh_Temple.jpg/1280px-Khajrana_Ganesh_Temple.jpg' },
  { name: 'omkareshwar.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Omkareshwar_Temple_View.jpg/1280px-Omkareshwar_Temple_View.jpg' },
  { name: 'mamleshwar.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mamleshwar_temple_complex%2C_Omkareshwar.jpg/1280px-Mamleshwar_temple_complex%2C_Omkareshwar.jpg' }
];

const targetDir = path.join(__dirname, 'public', 'history');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    }).on('error', reject);
  });
}

async function run() {
  for (const img of images) {
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, path.join(targetDir, img.name));
      console.log(`Success: ${img.name}`);
    } catch (err) {
      console.error(err);
    }
  }
}

run();
