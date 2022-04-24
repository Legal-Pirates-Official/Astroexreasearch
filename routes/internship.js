const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { isloggedin } = require('../middleware');

const router = express.Router();

router.get('/internship', (req, res) => {
	db.query('SELECT * FROM internship', (err, rows) => {
		if (!err) {
			res.render('internship', { internshipArray: rows });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/internship/:search', isloggedin, (req, res) => {
	const search = req.params.search;
	db.query(`SELECT * FROM internship`, (err, rows) => {
		if (!err) {
			console.log(search);
			let internshipArray = [];
			rows.forEach((element) => {
				console.log(
					element.heading_internship
						.toLowerCase()
						.includes(search.toLowerCase())
				);
				if (element.heading_internship.toLowerCase().includes(search)) {
					internshipArray.push(element);
				}
			});
			console.log(internshipArray);
			res.render('internship', { internshipArray });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/internship', isloggedin, (req, res) => {
	db.query('SELECT * FROM internship', (err, rows) => {
		if (!err) {
			res.render('./admin/internship/internship_show', {
				internshipArray: rows
			});
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/internship/insert', isloggedin, async (req, res) => {
	db.query('SELECT * FROM internship', async (err, rows) => {
		if (!err) {
			res.render('./admin/internship/internship_insert');
		} else {
			console.log(err);
		}
	});
});

router.post('/admin/internship/insert', isloggedin, async (req, res) => {
	console.log(req.body);
	let data;

	Object.keys(req.body).forEach((key, index) => {
		if (key.includes('tag_internship')) {
			data = !data
				? `${key}=${req.body[key]},`
				: Object.keys(req.body).length - 1 == index
				? data + `${key}=${req.body[key]}`
				: data + `${key}=${req.body[key]},`;
		}
	});

	await db.query(
		`INSERT INTO internship (heading_internship, subheading_internship, description_internship, tag_internship) VALUES (?, ?, ?, ?)`,
		[
			req.body.heading_internship,
			req.body.subheading_internship,
			req.body.description_internship,
			data
		],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/internship');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/admin/internship/:id', isloggedin, (req, res) => {
	db.query(
		'SELECT * FROM internship WHERE id_internship = ?',
		[req.params.id],
		(err, rows) => {
			if (!err) {
				res.render('./admin/internship/internship_view', {
					internship: rows[0]
				});
			} else {
				res.status(500).send('Internal server error');
				console.log(err);
			}
		}
	);
});

router.get('/admin/internship/update/:id', isloggedin, async (req, res) => {
	db.query(
		`SELECT * FROM internship WHERE id_internship = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				const taglines = rows[0].tag_internship.split(',');
				const tagArray = [];
				taglines.forEach((element) => {
					const tag = element.split('=')[1];
					tagArray.push(tag);
				});
				res.render('./admin/internship/internship_update', {
					internship: rows[0],
					tag_internship: tagArray,
					tag_length: tagArray.length
				});
			} else {
				console.log(err);
			}
		}
	);
});

router.post('/admin/internship/update/:id', isloggedin, async (req, res) => {
	let data;

	Object.keys(req.body).forEach((key, index) => {
		if (key.includes('tag_internship')) {
			data = !data
				? `${key}=${req.body[key]},`
				: Object.keys(req.body).length - 1 == index
				? data + `${key}=${req.body[key]}`
				: data + `${key}=${req.body[key]},`;
		}
	});
	db.query(
		`UPDATE internship SET heading_internship = ?, subheading_internship = ?, description_internship = ? , tag_internship = ?  WHERE id_internship = ?`,
		[
			req.body.heading_internship,
			req.body.subheading_internship,
			req.body.description_internship,
			data,
			req.params.id
		],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/internship');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/admin/internship/delete/:id', isloggedin, async (req, res) => {
	db.query(
		`DELETE FROM internship WHERE id_internship = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/internship');
			} else {
				console.log(err);
			}
		}
	);
});

module.exports = router;
