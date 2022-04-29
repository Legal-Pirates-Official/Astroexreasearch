const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.get("/" , (req, res) => {
    db.query("SELECT * FROM events", (err, rows) => {
        if (!err) {
            res.render("index", {eventsArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
})

module.exports = router;
