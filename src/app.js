const express = require('express');
const app = express()
const morgan = require('morgan');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
 
mongoose.connect(process.env.MONGO_ATLAS_PW,
{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/uploads',express.static('src/uploads'));
app.use("/", routes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});

module.exports = app;