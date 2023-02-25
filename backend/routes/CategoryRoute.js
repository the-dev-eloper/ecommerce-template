const express = require('express');
const { Category } = require('../models/CategoryModel');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false});
    }

    res.status(200).send(categoryList);
});

router.post(`/`, async (req, res) => {
    let newCategory = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    newCategory = await newCategory.save();

    if(!newCategory)
        return res.status(400).send('the category cannot be created!')

    res.send(newCategory);
});

router.delete(`/:id`, async (req, res) => {
    Category.findByIdAndRemove(req.params.id)
        .then(category => {
            if(category) {
                return res.status(200).json({success: true, message: 'the category is deleted!'})
            } else {
                return res.status(404).json({success: false , message: "category not found!"})
            }
        }).catch(err=>{
           return res.status(500).json({success: false, error: err}) 
        })
});

module.exports = router;