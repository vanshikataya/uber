const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const connectToDb = require('./db/db');



connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users', require('./routes/user.routes')); 


module.exports = app;