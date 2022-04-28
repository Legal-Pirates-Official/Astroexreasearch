const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

<<<<<<< HEAD
router.get('/', (req, res) => {
	db.query('SELECT * FROM events', (err, rows) => {
		if (!err) {
			res.render('index', { eventsArray: rows });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});
=======
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
>>>>>>> e2f7de2b1c78200a0e8a2e8c87b1a7265a215ded

module.exports = router;
