const express = require('express');
const router = require('./Routing/routing');
const bodyParser = require('body-parser');
const ErrorLoggerMiddleware = require('./utilities/ErrorLoggerMiddleware');

const app = express();
const port = 2000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(ErrorLoggerMiddleware);
// setting router
app.use('/', router);

app.listen(port, ()=> {
    console.log(`Server is running on http://localhost:${port}`);
})