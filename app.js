const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const colors = require('colors');
const taskRoutes = require('./routes/tasks');

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
    'Content-Type, Authorization',
  );
  next();
});

app.use(bodyParser.json());

app.use('/api', taskRoutes);

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(process.env.PORT || 8080))
  .catch(error =>
    console.log(colors.red('💩 💩 💩 MONGODB ERROR'), error),
  );
