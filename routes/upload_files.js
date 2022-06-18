const express = require('express');
const db = require('../database');
const multer = require('multer');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { isloggedin } = require('../middleware');

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
		await db.query(
			'INSERT INTO upload_files SET name_upload_files = ?, file_upload_files = ?',
			[req.body.name_upload_files, req.file.path]
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
			'AsteroexResearch/' + filename
		);
		await db.query('DELETE FROM upload_files WHERE name_upload_files = ?', [
			'AsteroexResearch/' + filename
		]);
		res.redirect('/admin/upload_files');
	}
);

module.exports = router;
