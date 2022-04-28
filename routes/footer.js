const express = require('express');
const app = express();
const db = require('../database');
const path = require('path');
const { isloggedin } = require('../middleware');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/admin/footer_contact', (req, res) => {
	db.query('SELECT * FROM footer_contact', (err, rows) => {
		if (!err) {
			res.render('./admin/footer_contact/footer_show', {
				footer_contactArry: rows
			});
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.post('/admin/footer_contact/insert', (req, res) => {
	db.query(
		`INSERT INTO footer_contact (email_footer) VALUES (?)`,
		[req.body.email_footer],
		(err, rows) => {
			if (!err) {
				res.redirect('/');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/admin/footer_contact/message', (req, res) => {
	db.query('SELECT * FROM footer_contact', (err, rows) => {
		if (!err) {
			res.render('./admin/footer_contact/footer_message', {
				footer_contactArry: rows
			});
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'geniuscriminaloffical@gmail.com',
		pass: 'Latha13087280$#'
	}
});

router.post('/admin/footer_contact/message', async (req, res) => {
	const { subscribemessage } = req.body;

	await db.query(`SELECT * FROM footer_contact`, (err, rows) => {
		console.log(rows[0]);
		if (!err) {
			rows.forEach(async (mail) => {
				const mailOptions = {
					from: 'geniuscriminaloffical@gmail.com',
					to: mail.email_footer,
					subject: 'Message from Astroxresearch',
					text:
						subscribemessage +
						'\n\n' +
						`<a href="/footer_contact/opt-out/${mail.id_footer}">Opt out</a>`
				};
				new Promise(async (resolve, reject) => {
					await transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							// console.log(error);
							resolve();
						} else {
							resolve();
							// console.log('Email sent: ' + info.response);
						}
					});
				});
			});
			res.redirect('/admin/footer_contact/message');
		} else {
			console.log(err);
		}
	});
});

router.get('/admin/footer_contact/delete/:id', isloggedin, async (req, res) => {
	db.query(
		`DELETE FROM footer_contact WHERE id_footer = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.redirect('/admin/footer_contact');
			} else {
				console.log(err);
			}
		}
	);
});

router.get('/footer_contact/opt-out/:id', async (req, res) => {
	res.send(
		'<a href="/footer_contact/opt-out/' + req.params.id + '">Opt out</a>'
	);
});

router.get('/admin/footer_contact/opt-out/:id', async (req, res) => {
	db.query(
		`DELETE FROM footer_contact WHERE id_footer = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.redirect('/');
			} else {
				console.log(err);
			}
		}
	);
});

module.exports = router;
