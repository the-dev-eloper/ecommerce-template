const express = require('express');
const { Category } = require('../models/CategoryModel');
const { Product } = require('../models/ProductModel');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const productList = await Product.find().populate('category');

    if(!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
});

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product)
        return res.status(500).json({success: false, message: 'Product not found'});

    res.status(200).send(product);
});

router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    newProduct = await newProduct.save();
    if(!newProduct) return res.status(500).send('The product cannot be created');

    res.send(newProduct);
});

router.put(`/:id`, async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    if(updatedProduct) {
        res.status(200).json({ success: true, message: 'Product Updated Successfully'});
    } else {
        res.status(500).json({ success: false, message: 'Updation Failed'});
    }
});

module.exports = router;