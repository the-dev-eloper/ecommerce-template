const express = require('express');
const app = express();

const morgan = require('morgan');
require('dotenv/config');

const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    res.send(newProduct);
});

app.listen(3000, () => {
    console.log('App runs')
});