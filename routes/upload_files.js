const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { isloggedin } = require('../middleware');
const fs = require('fs');

const router = express.Router();

router.get('/admin/upload_files', isloggedin, (req, res) => {
	db.query('SELECT * FROM upload_files', (err, rows) => {
		if (!err) {
			res.render('./admin/upload/upload_show', { upload_filesArray: rows });
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/upload_files/insert', isloggedin, async (req, res) => {
	db.query('SELECT * FROM upload_files', async (err, rows) => {
		if (!err) {
			res.render('./admin/upload/upload_insert');
		} else {
			console.log(err);
		}
	});
});

router.post(
	'/admin/upload_files/insert',
	isloggedin,
	upload.single('file_upload_files'),
	async (req, res) => {
		console.log(req.file);
		await db.query(
			'INSERT INTO upload_files SET name_upload_files = ?, file_upload_files = ?',
			[req.file.filename, req.file.path]
		);
		res.redirect('/admin/upload_files');
	}
);

router.get(
	'/admin/upload_files/delete/:filename',
	isloggedin,
	async (req, res) => {
		const { filename } = req.params;
		await cloudinary.uploader.destroy(
			'Astroex_Research_Association/' + filename
		);
		await db.query('DELETE FROM upload_files WHERE name_upload_files = ?', [
			'Astroex_Research_Association/' + filename
		]);
		res.redirect('/admin/upload_files');
	}
);

module.exports = router;
