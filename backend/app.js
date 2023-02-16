const express = require('express');
const app = express();

const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

require('dotenv/config');
const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(morgan('tiny'));

const productModel = mongoose.Schema({
    name: String,
    price: Number,
    countInStock: Number
});
const Product = mongoose.model('Product', productModel);

app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        countInStock: req.body.countInStock
    });

    newProduct.save()
        .then(() => {
            res.status(201).json({ success: true, product: newProduct });
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err });
        })
});

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
    console.log('App runs')
});