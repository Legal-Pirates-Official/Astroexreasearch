const express = require('express');
const app = express();
const db = require('../database');

const router = express.Router();

router.get('/partners', (req, res) => {
	res.render('partners');
});

// router.get("/publications", (req, res) => {
//     res.render("publications");
// });

module.exports = router;
