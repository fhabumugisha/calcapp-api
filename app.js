const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const chalk = require('chalk');
const debug = require('debug')('app');


// Database
const mongoose = require('mongoose');
// const MONGODB_URI = "mongodb://localhost:27017/calcapp";
const MONGODB_URI = `mongodb+srv://mongofab:${process.env.MONGO_ATLAS_PW}@cluster0-iogap.mongodb.net/calcapp?retryWrites=true&w=majority`;

// Routes imports
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
// The app
const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
// Parse the request body
app.use(bodyParser.json());
// Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Default port
const port = process.env.PORT || 3000;

// Routes
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  // eslint-disable-next-line no-console
  debug(chalk.red(error));
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});


// Connect to database and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(port, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(chalk.red(error));
      }
      debug(`Listing at port ${chalk.green(port)}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(chalk.red(error));
  });
