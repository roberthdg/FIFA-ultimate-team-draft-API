const express = require('express');
const app = express()
const morgan = require('morgan');
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
 
mongoose.connect('mongodb+srv://roberthdg:'+process.env.MONGO_ATLAS_PW+'@fut-api-database-vptdu.mongodb.net/test?retryWrites=true&w=majority')

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/", routes);
app.use(cors());

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