const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*', cors());

mongoose.set("strictQuery", false);
const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

// Routes
const productRoute = require('./routes/ProductRoute');
app.use(`${api}/products`, productRoute);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop'
})
    .then(() => {
        console.log('Database Connection is ready...')
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(3000, () => {
    console.log('App runs');
});