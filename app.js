const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
//Database
const mongoose = require('mongoose');
//const MONGODB_URI = "mongodb://localhost:27017/calcapp";
const MONGODB_URI = 'mongodb+srv://mongofab:'+ process.env.MONGO_ATLAS_PW +'@cluster0-iogap.mongodb.net/calcapp?retryWrites=true&w=majority';

//Routes imports
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
//The app
const app = express();
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined', { stream: accessLogStream }));
//Parse the request body
app.use(bodyParser.json());
//Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Default port
const port = 3000;

//Routes
app.use('/projects', projectRoutes);
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);

//Error handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


//Connect to database and start server
mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(error => {
        console.log(error);
    });




