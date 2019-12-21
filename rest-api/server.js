const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const quoteRoutes = require('./routes/quote');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
    next();
});

app.use(authRoutes);
app.use(userRoutes);
app.use(quoteRoutes);

app.use((error, req, res, next) => {
    console.log('HEREEEEEEEEEEEEEEEEEEE');
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    })
});

const MONGODB_URI = 'mongodb+srv://mnazmi:HvGMsyu29fXUOvOD@cluster0-rbjdo.mongodb.net/quoteblog';

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