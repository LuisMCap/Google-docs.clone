const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const app = express();

require("dotenv").config();
require('./config/database');
require('./models/user');
require('./config/passport')(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://google-docs-clone-xi-six.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));
require('./config/socket')

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send('error');
});

module.exports = app
