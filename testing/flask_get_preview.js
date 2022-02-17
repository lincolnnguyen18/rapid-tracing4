import fetch from 'node-fetch';
import fs from 'fs';

// const stats = fs.statSync("fries.jpeg");
// const fileSizeInBytes = stats.size;
// let readStream = fs.createReadStream('fries.jpeg');

fetch('http://localhost:3001/get-picture-preview', {
  method: 'POST',
  headers: {
    "Content-length": fileSizeInBytes
  },
  body: readStream
})
.then(res => res.json())
.then(json => console.log(json));