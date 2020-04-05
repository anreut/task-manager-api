const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// import environment variables from .env
require('dotenv').config();

const app = express();

// Prevent CORS
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, x-token, x-refresh-token',
  );
  next();
});

app.use(bodyParser.json());

app.use('/api', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
  })
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log(colors.green('CONNECTED TO MONGODB'));
  })
  .catch((error) =>
    console.log(colors.red('💩 💩 💩 MONGODB ERROR'), error),
  );
