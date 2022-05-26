const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { ValidationError } = require('sequelize')

const routes = require('./routes')
const { environment } = require('./config')
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

// middleware for security
if (!isProduction) {
    app.use(cors());
}

// sets various headers to secure the app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

// set up the csrftoken

app.use(
    csurf({
        cookie: {
        secure: isProduction,
        sameSite: isProduction && 'Lax',
        httpOnly: true,
        }
    })
);

// connect the routes
app.use(routes);

//error handlers: general missing resource
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});

// Sequelize errors
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation Error';
    }
    next(err);
})

// error formatter
app.use((err, _req, res, _next) =>{
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});


module.exports = app;
