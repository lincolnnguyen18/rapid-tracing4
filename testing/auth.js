import fetch from 'node-fetch';

let cookie = null;
fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
}).then(res => {
  cookie = res.headers.get('set-cookie');
  console.log(`Cookie: ${cookie}`);
  return res.json();
}).then(data => console.log(data));

fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
}).then(res => {
  cookie = res.headers.get('set-cookie');
  console.log(`Cookie: ${cookie}`);
  res.json();
});