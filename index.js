var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'Ln2121809', (err, decoded) => {
      if (!err) {
        db.get("select * from users where id = ?", decoded.id, function(err, row) {
          if (!err && row) {
            req.id = row.id;
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
        db.get("select * from users where id = ?", decoded.id, function(err, row) {
          if (!err && row) {
            req.id = row.id;
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
  db.get("select * from users where username = ?", username, function(err, row) {
    if (!err && row) {
      bcrypt.compare(password, row.password, function(err, result) {
        if (!err && result) {
          let token = jwt.sign({ id: row.id }, 'Ln2121809');
          res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
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
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.run("insert into users (username, password) values (?, ?)", username, hash, function(err) {
      if (err) {
        res.status(500).send({ error: 'Username already exists' });
      } else {
        let token = jwt.sign({ id: this.lastID }, 'Ln2121809');
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });
        res.send({ message: 'OK' })
      }
    });
  }
});

router.get('/logout', function (req, res) {
  res.clearCookie('token');
  res.redirect('/login');
});
app.use('/api', router);

app.get('/', isLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/pages/trace.html');
});
app.get('/login', isNotLoggedIn, (req, res) => {
  res.sendFile(__dirname + '/pages/login.html');
});
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));