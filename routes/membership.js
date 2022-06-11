const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { isloggedin } = require('../middleware');

const router = express.Router();

router.get('/admin/membership', isloggedin, (req, res) => {
	res.render('./admin/membership/membership_show');
});

router.get('/admin/membership/insert', isloggedin, (req, res) => {
	let data;

	Object.keys(req.body).forEach((key, index) => {
		if (key.includes('tag_membership')) {
			data = !data
				? `${key}=${req.body[key]},`
				: Object.keys(req.body).length - 1 == index
				? data + `${key}=${req.body[key]}`
				: data + `${key}=${req.body[key]},`;
		}
	});

	res.render('./admin/membership/membership_insert');
});

router.get('/admin/membership/para', async (req, res) => {
	try {
		await db.query(`SELECT * FROM membership`, (err, result) => {
			if (err) throw err;
			res.json(result);
		});
		console.log(data);
	} catch (err) {
		console.log(err);
	}
});

router.post('/admin/membership/para', async (req, res) => {
	try {
		await db.query('INSERT INTO membership SET ?', req.body, (err, result) => {
			if (err) throw err;
			res.json(result);
		});
	} catch (error) {
		console.log(error);
	}
});

router.post('/admin/membership/para/delete', async (req, res) => {
	try {
		await db.query(
			'DELETE FROM membership where membership_id = ?',
			[req.body.membership_id],
			req.body,
			(err, result) => {
				if (err) throw err;
				res.json(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.get('/admin/membership/table1', async (req, res) => {
	try {
		await db.query(`SELECT * FROM membership_table1`, (err, result) => {
			if (err) throw err;
			res.json(result);
		});
		console.log(data);
	} catch (err) {
		console.log(err);
	}
});

router.post('/admin/membership/table1', async (req, res) => {
	try {
		await db.query(
			'INSERT INTO membership_table1 SET ?',
			req.body,
			(err, result) => {
				if (err) throw err;
				res.json(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.post('/admin/membership/table1/delete', async (req, res) => {
	try {
		await db.query(
			'DELETE FROM membership_table1 where membership_table1_id = ?',
			[req.body.membership_id],
			req.body,
			(err, result) => {
				if (err) throw err;
				res.json(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.get('/admin/membership/table2', async (req, res) => {
	try {
		await db.query(`SELECT * FROM membership_table2`, (err, result) => {
			if (err) throw err;
			res.json(result);
		});
		console.log(data);
	} catch (err) {
		console.log(err);
	}
});

router.post('/admin/membership/table2', async (req, res) => {
	try {
		await db.query(
			'INSERT INTO membership_table2 SET ?',
			req.body,
			(err, result) => {
				if (err) throw err;
				res.json(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

router.post('/admin/membership/table2/delete', async (req, res) => {
	try {
		await db.query(
			'DELETE FROM membership_table2 where membership_id = ?',
			[req.body.membership_id],
			req.body,
			(err, result) => {
				if (err) throw err;
				res.json(result);
			}
		);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
