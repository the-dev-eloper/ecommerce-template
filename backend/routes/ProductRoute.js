const express = require('express');
const { mongoose } = require('mongoose');
const { Category } = require('../models/CategoryModel');
const { Product } = require('../models/ProductModel');
const router = express.Router();

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories) {
        filter = { category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');

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
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }

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

router.delete(`/:id`, (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if(product) {
                return res.status(200).json({success: true, message: 'Deleted Successfully!'});
            } else {
                return res.status(404).json({success: false , message: "Product not found!"});
            }
        }).catch(err=>{
           return res.status(500).json({success: false, error: err});
        })
});

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount,
    });
});

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ?? 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(+count);

    if (!featuredProducts) {
        res.status(500).json({ success: false });
    }
    res.send(featuredProducts);
});

module.exports = router;