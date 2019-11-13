const express = require('express');
const bodyParser = require('body-parser');

//Database
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/calcapp";

//The app
const app = express();

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
app.get('/', (req, res) => {
    res.status(200).json('GET request to the homepage')
})

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
        app.listen(port);
    })
    .catch(error => {
        console.log(error);
    });




