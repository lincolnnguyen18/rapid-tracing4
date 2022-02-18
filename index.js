// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('data.db');
const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'pass123',
  database: 'rapid_tracing'
});
const express = require('express');
const cookieParser = require('cookie-parser');
const file_upload = require('express-fileupload');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongo = require('mongodb');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(file_upload());
app.use(express.static('public'));

let temp_files_seconds_since_last_access = {};

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'Ln2121809', (err, decoded) => {
      if (!err && decoded.id) {
        // db.get("select * from users where id = ?", decoded.id, function(err, row) {
        //   if (!err && row) {
        //     req.id = row.id;
        //     next();
        //   } else { res.redirect('/login'); }
        // });
        conn.execute("select * from users where id = ?", [decoded.id], function(err, rows) {
          if (!err && rows && rows[0]) {
            req.id = rows[0].id;
            next();
          } else { res.redirect('/login'); }
        });
      } else { res.redirect('/login'); }
    });
  } else { res.redirect('/login'); }
};

const isNotLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'Ln2121809', (err, decoded) => {
      if (!err) {
        // db.get("select * from users where id = ?", decoded.id, function(err, row) {
        //   if (!err && row) {
        //     req.id = row.id;
        //     res.redirect('/');
        //   } else { next(); }
        // });
        conn.execute("select * from users where id = ?", [decoded.id], function(err, rows) {
          if (!err && rows && rows[0]) {
            req.id = rows[0].id;
            res.redirect('/');
          } else { next(); }
        });
      } else { next(); }
    });
  } else { next(); }
};

const router = express.Router();

router.post('/login', function (req, res) {
  let { username, password } = req.body
  // db.get("select * from users where username = ?", username, function(err, row) {
  conn.execute("select * from users where username = ?", [username], function(err, rows) {
    if (!err && rows) {
      let row = rows[0];
      bcrypt.compare(password, row.password, function(err, result) {
        if (!err && result) {
          let token = jwt.sign({ id: row.id }, 'Ln2121809');
          res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
          res.cookie('id', row.id, { sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
          res.send({ message: 'OK' })
        } else {
          res.send({ error: 'Incorrect username or password.' })
        }
      })
    } else {
      res.send({ error: 'Incorrect username or password.' })
    }
  })
});

router.post('/register', function (req, res) {
  let { username, password } = req.body
  if(!username.trim() || !password.trim()) {
    res.send({ error: 'Username and password are required.' })
  } else if (username.length > 255) {
    res.send({ error: 'Username is too long.' })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    // db.run("insert into users (username, password) values (?, ?)", username, hash, function(err) {
    conn.execute("insert into users (username, password) values (?, ?)", [username, hash], function(err) {
      if (err) {
        res.send({ error: 'Username already exists' });
      } else {
        fs.mkdirSync(`./shared/${this.lastID}`);
        fs.mkdirSync(`./shared/${this.lastID}/temp`);
        fs.mkdirSync(`./shared/${this.lastID}/library`);
        let token = jwt.sign({ id: this.lastID }, 'Ln2121809');
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
        res.cookie('id', this.lastID, { sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
        res.send({ message: 'OK' })
      }
    });
  }
});

// CREATE TABLE IF NOT EXISTS pictures (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   filename TEXT NOT NULL,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );

router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});
/* add picture to library stuff */
router.post('/add-picture', isLoggedIn, function (req, res) {
  let { filename, extension } = req.body
  let old_dir_path = `./shared/${req.id}/temp/${filename}`
  let new_dir_path = `./shared/${req.id}/library/${filename}`
  fs.rename(old_dir_path, new_dir_path, function(err) {
    if (err) {
      res.send({ error: 'Could not add picture to library.' });
    } else {
      // db.run("insert into pictures (filename) values (?)", filename, function(err) {
      conn.execute("insert into pictures (filename) values (?)", [filename], function(err) {
        if (err) {
          res.send({ error: 'Could not add picture to library.' });
        } else {
          res.send({ message: 'OK' });
        }
      });
    }
  });
});

/* file upload stuff */
router.post('/get-picture-preview', isLoggedIn, (req, res) => {
  const size = req.query.size;
  const sigma = req.query.sigma;
  console.log('/get-picture-preview called');
  if (req.files && req.files.picture) {
    let file = req.files.picture;
    let temp_name = Math.random().toString(36).substring(7)
    while (fs.existsSync(`./shared/${req.id}/temp/${temp_name}` || fs.existsSync(`./shared/${req.id}/library/${temp_name}`))) {
      temp_name = Math.random().toString(36).substring(7)
    }
    const extension = file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
    if (!fs.existsSync(`./shared/${req.id}/temp/${temp_name}`)) {
      fs.mkdirSync(`./shared/${req.id}/temp/${temp_name}`);
    }
    file.mv(`${__dirname}/shared/${req.id}/temp/${temp_name}/original.${extension}`, function(err) {
      if (err) {
        console.log(err);
        res.send({ error: 'Error uploading file.' });
      } else {
        fetch(`http://localhost:3001/get-picture-preview?size=${size}&sigma=${sigma}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: temp_name,
            extension: extension,
            user_id: req.id
          })
        })
        .then(res => res.json())
        .then(json => {
          console.log(json);
          if (!temp_files_seconds_since_last_access[req.id]) {
            temp_files_seconds_since_last_access[req.id] = {};
          }
          temp_files_seconds_since_last_access[req.id][temp_name] = 0;
          let interval = setInterval(() => {
            if (temp_files_seconds_since_last_access[req.id][temp_name] >= 60) {
              if (fs.existsSync(`./shared/${req.id}/temp/${temp_name}`)) {
                fs.rm(`${__dirname}/shared/${req.id}/temp/${temp_name}`, { recursive: true, force: true }, function(err) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
              clearInterval(interval);
            } else {
              temp_files_seconds_since_last_access[req.id][temp_name]++;
              console.log(`${req.id}, ${temp_name}: ${temp_files_seconds_since_last_access[req.id][temp_name]}`);
            }
          }, 1000);
          res.send({ filename: temp_name, extension: extension });
        });
      }
    });
  } else {
    res.send({ error: 'Error uploading file.' });
  }
});
app.use('/api', router);

app.get('/', isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/pages/trace.html');
});
app.get('/login', isNotLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/pages/login.html');
});
app.get("/shared/:id/temp/:filename/:type", isLoggedIn, (req, res) => {
  console.log(`User with id ${req.id} is trying to access file named '${req.params.filename}' directory with id ${req.params.id}`);
  if (req.params.id == req.id) {
    temp_files_seconds_since_last_access[req.id][req.params.filename] = 0;
    let path = __dirname + `/shared/${req.params.id}/temp/${req.params.filename}/${req.params.type}`;
    if (fs.existsSync(path)) {
      res.sendFile(path);
    } else {
      res.sendFile(__dirname + '/pages/404.html');
    }
  } else {
    res.sendFile(__dirname + '/pages/404.html');
  }
});
app.get("/shared/:id/library/:filename/:type", isLoggedIn, (req, res) => {
  console.log(`User with id ${req.id} is trying to access file named '${req.params.filename}' directory with id ${req.params.id}`);
  if (req.params.id == req.id) {
    let path = __dirname + `/shared/${req.params.id}/library/${req.params.filename}/${req.params.type}`;
    if (fs.existsSync(path)) {
      res.sendFile(path);
    } else {
      res.sendFile(__dirname + '/pages/404.html');
    }
  } else {
    res.sendFile(__dirname + '/pages/404.html');
  }
});
app.get('*', (req, res) => {
  console.log(`Invalid request: ${req.url}`);
  res.sendFile(__dirname + '/pages/404.html');
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));