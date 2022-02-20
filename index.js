const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'pass123',
  database: 'rapid_tracing',
  multipleStatements: true
});
const express = require('express');
const cookieParser = require('cookie-parser');
const file_upload = require('express-fileupload');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
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
        conn.execute("select * from users where id = ?", [decoded.id], function(err, rows) {
          if (!err && rows && rows.length > 0 && rows[0]) {
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
      if (!err && decoded.id) {
        conn.execute("select * from users where id = ?", [decoded.id], function(err, rows) {
          if (!err && rows && rows.length > 0 &&rows[0]) {
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
  conn.execute("select * from users where username = ?", [username], function(err, rows) {
    if (!err && rows && rows.length > 0) {
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
    conn.query("CALL register_user(?, ?, @user_id); select @user_id", [username, hash], function(err, result) {
      if (err) {
        res.send({ error: 'Username already exists' });
      } else if (!result || !result[1] || !result[1][0] || !result[1][0]['@user_id']) {
        res.send({ error: 'Error registering user.' });
      } else {
        let user_id = result[1][0]['@user_id'];
        fs.mkdirSync(`./shared/${user_id}`);
        fs.mkdirSync(`./shared/${user_id}/temp`);
        fs.mkdirSync(`./shared/${user_id}/library`);
        let token = jwt.sign({ id: user_id }, 'Ln2121809');
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
        res.cookie('id', user_id, { sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
        res.send({ message: 'OK' })
      }
    });
  }
});
router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});
/* add picture to library stuff */
router.post('/add-picture', isLoggedIn, function (req, res) {
  let { filename, extension } = req.body;
  console.log(filename, extension);
  let old_dir_path = `./shared/${req.id}/temp/${filename}`;
  let new_dir_path = `./shared/${req.id}/library/${filename}`;
  fs.rename(old_dir_path, new_dir_path, function(err) {
    if (err) {
      res.send({ error: 'Could not add picture to library.' });
    } else {
      conn.execute("CALL add_picture(?, ?, ?)", [filename, extension, req.id], function(err, result) {
        if (err) {
          console.log(err);
          res.send({ error: 'Could not add picture to library.' });
        } else {
          res.send({ message: 'OK' });
        }
      });
    }
  });
});
/* get user pictures stuff */
router.get('/get-pictures', isLoggedIn, function (req, res) {
  conn.execute("CALL get_user_pictures(?)", [req.id], function(err, result) {
    if (err) {
      res.send({ error: 'Could not get user pictures.' });
    } else {
      res.send(result[0]);
    }
  });
});

router.get('/get-picture-last-timerecord', isLoggedIn, function (req, res) {
  const { picture_id } = req.query;
  console.log(picture_id);
  conn.execute("CALL get_picture_last_timerecord(?, ?)", [req.id, picture_id], function(err, result) {
    if (err) {
      console.log(err);
      res.send({ error: 'Could not get picture last time record.' });
    } else {
      console.log(result[0]);
      res.send(result[0][0]);
    }
  });
});

// time record stuff
router.post('/add-time-record', isLoggedIn, function (req, res) {
  let { seconds, picture_id } = req.body;
  conn.execute("CALL add_time_record(?, ?, ?)", [seconds, req.id, picture_id], function(err, result) {
    if (err) {
      res.send({ error: 'Could not add time record.' });
    } else {
      res.send({ message: 'OK' });
    }
  });
});
router.post('/get-picture-timerecords-chart', isLoggedIn, function (req, res) {
  let { picture_id } = req.body;
  if (!picture_id) {
    res.send({ error: 'No picture id provided.' });
  } else {
    console.log('/get-picture-timerecords-chart, req.id:' + req.id);
    fetch('http://localhost:3001/get-picture-timerecords-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: req.id, picture_id: picture_id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        res.send(data);
      } else {
        const { temp_name } = data;
        if (!temp_files_seconds_since_last_access[req.id])
          temp_files_seconds_since_last_access[req.id] = {};
        temp_files_seconds_since_last_access[req.id][temp_name] = 0;
        let interval = setInterval(() => {
          if (temp_files_seconds_since_last_access[req.id][temp_name] >= 30) {
            fs.unlinkSync(`./shared/${req.id}/temp/${temp_name}`);
            clearInterval(interval);
            delete temp_files_seconds_since_last_access[req.id][temp_name];
          } else {
            temp_files_seconds_since_last_access[req.id][temp_name]++;
            console.log(`${req.id}, ${temp_name}: ${temp_files_seconds_since_last_access[req.id][temp_name]}`);
          }
        }, 1000);
        console.log(data);
        res.send(data);
      }
    })
    .catch(err => {
      console.log(err);
      res.send({ error: 'Could not get picture time records chart.' });
    });
  }
});

/* file upload stuff */
router.post('/get-picture-preview', isLoggedIn, (req, res) => {
  const size = req.query.size;
  const sigma = req.query.sigma;
  console.log('/get-picture-preview called');
  if (req.files && req.files.picture) {
    let file = req.files.picture;
    console.log(file.mimetype);
    // only allow png, jpeg, and jpg
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
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
            if (!temp_files_seconds_since_last_access[req.id])
              temp_files_seconds_since_last_access[req.id] = {};
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
                delete temp_files_seconds_since_last_access[req.id][temp_name];
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
      res.send({ error: 'Invalid file type.' });
    }
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
app.get("/shared/:id/temp/:tempfile", isLoggedIn, (req, res) => {
  console.log(`User with id ${req.id} is trying to access file named '${req.params.tempfile}' directory with id ${req.params.id}`);
  if (req.params.id == req.id) {
    let without_extension = req.params.tempfile.substring(0, req.params.tempfile.lastIndexOf('.'));
    temp_files_seconds_since_last_access[req.id][without_extension] = 0;
    let path = __dirname + `/shared/${req.params.id}/temp/${req.params.tempfile}`;
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
app.get('*', isLoggedIn, (req, res) => {
  console.log(`Invalid request: ${req.url}`);
  res.sendFile(__dirname + '/pages/404.html');
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));