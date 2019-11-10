const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const quoteRoutes = require('./routes/quote');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
    next();
});

app.use(quoteRoutes);

const MONGODB_URI = 'mongodb+srv://mnazmi:HvGMsyu29fXUOvOD@cluster0-rbjdo.mongodb.net/socialnetwork';

mongoose
    .connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });