const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

router.post('/image', upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({error: 'No file uploaded'});
    }
    res.json({url: `/uploads/${req.file.filename}`});
});

module.exports = router;