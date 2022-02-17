import fetch from 'node-fetch';
import fs from 'fs';

fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'lincoln',
    password: '123'
  })
}).then(res => {
  res.json().then(json => console.log(json));
  return res.headers.get('set-cookie');
}).then(token => {
  console.log(`Token: ${token}`);
  const stats = fs.statSync("fries.jpeg");
  const fileSizeInBytes = stats.size;
  // You can pass any of the 3 objects below as body
  let readStream = fs.createReadStream('fries.jpeg');
  //var stringContent = fs.readFileSync('fries.jpeg', 'utf8');
  //var bufferContent = fs.readFileSync('fries.jpeg');
  fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: {
          "Content-length": fileSizeInBytes,
          "Content-Type": "image/jpeg",
          "Cookie": `token=${token}`
      },
      body: readStream // Here, stringContent or bufferContent would also work
  })
})