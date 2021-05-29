const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    res.header('Content-Security-Policy', 'script-src *');
    res.render('index')
});

module.exports = router;