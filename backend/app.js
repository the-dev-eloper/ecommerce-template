const express = require('express');
const app = express();

// Middleware
app.use(express.json());

app.post('/api/v1/products', (req, res) => {
    const newProduct = req.body;
    res.send(newProduct);
})

app.listen(3000, () => {
    console.log('App runs')
});