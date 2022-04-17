const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.get('/training', (req, res) => {
	db.query('SELECT * FROM training', (err, rows) => {
		if (!err) {
			res.render('training', { training: rows[0] });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/training', (req, res) => {
	db.query('SELECT * FROM training', (err, rows) => {
		if (!err) {
			res.render('./admin/training/training_show', { trainingArray: rows });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/training/insert', async (req, res) => {
	db.query('SELECT * FROM training', async (err, rows) => {
		if (!err) {
			res.render('./admin/training/training_insert');
		} else {
			console.log(err);
		}
	});
});

router.post('/admin/training/insert', async (req, res) => {
	console.log(req.body);
	db.query(
		`INSERT INTO training (title_training, paragraph_training, batch_training) VALUES (?, ?, ?)`,
		[
			req.body.title_training,
			req.body.paragraph_training,
			req.body.batch_training
			
		],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/training');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/admin/training/:id', (req, res) => {
	db.query(
		'SELECT * FROM training WHERE id_training = ?',
		[req.params.id],
		(err, rows) => {
			if (!err) {
				res.render('./admin/training/training_view', {
					training: rows[0]
				});
			} else {
				res.status(500).send('Internal server error');
				console.log(err);
			}
		}
	);
});

router.get('/admin/training/update/:id', async (req, res) => {
	db.query(
		`SELECT * FROM training WHERE id_training = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.render('./admin/training/training_update', {
					training: rows[0]
				});
			} else {
				console.log(err);
			}
		}
	);
});

router.post('/admin/training/update/:id', async (req, res) => {
	console.log(req.body);
	db.query(
		`UPDATE training SET title_training = ?, paragraph_training = ?, batch_training = ?  WHERE id_training = ?`,
		[
			req.body.title_training,
			req.body.paragraph_training,
			req.body.batch_training,
			req.params.id
		],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/training');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/admin/training/delete/:id', async (req, res) => {
	db.query(
		`DELETE FROM training WHERE id_training = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/training');
			} else {
				console.log(err);
			}
		}
	);
});

module.exports = router;
