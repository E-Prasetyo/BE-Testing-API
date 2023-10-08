require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    // cb(null, moment().format('YYYY-MM-DD-HHmmss') + file.originalname )
    cb(null, uuidv4() )
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// path.dirname(process.mainModule.filename);

app.use(cors())
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);

mongoose
  .connect(process.env.APP_DB_MONGGODB)
  .then(result => {
    const server = app.listen(process.env.APP_PORT);
    console.log('Client connected in ' + process.env.APP_PORT);
    // const io = require('./socket').init(server, { cors: { origin: '*' } });
    // const io = require('socket.io')(server, { cors: { origin: '*' } });
    // io.on('connection', socket => {
    //   console.log('Client connected');
    // });
  })
  .catch(err => console.log(err));