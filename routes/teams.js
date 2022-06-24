const express = require('express');
const app = express();
const db = require('../database');
const multer = require('multer');
const path = require('path');
const { storage, cloudinary } = require('../cloudinary');
const upload = multer({ storage });
const { isloggedin } = require('../middleware');

const router = express.Router();


router.get('/admin/teams', isloggedin, (req, res) => {
	const message = req.flash('success');
	res.render('./admin/teams/team_show', {
		message
	});

});


router.get('/teams', (req, res) => {
	db.query('SELECT * FROM teams', (err, rows) => {
		if (!err) {
			res.render('teams', {
				teamArray: rows
			});
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/teams-advisior', (req, res) => {
	db.query('SELECT * FROM teams', (err, rows) => {
		if (!err) {
			res.render('teams_advisior', {
				teamArray: rows
			});
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/teamsarray', isloggedin, (req, res) => {
	db.query('SELECT * FROM teams ORDER BY order_team', (err, rows) => {
		if (!err) {
			return res.json(rows)
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});

router.get('/admin/teamsidarray', isloggedin, (req, res) => {
	db.query('SELECT id_team FROM teams ORDER BY order_team', (err, rows) => {
		if (!err) {
			let arr = []
			rows.forEach(row => {
				arr.push(Object.values(row)[0])
			});
			res.json(arr);
		} else {
			res.status(500).send('Internal server error');
			console.log(err);
		}
	});
});
router.post('/admin/save-sort', async (req, res) => {
	const { order } = req.body
	new Promise(async (myResolve, myReject) => {

		await order.forEach(async (o, index) =>
			await db.query('UPDATE teams SET order_team = ? WHERE id_team = ?', [index + 1, o], async (err, response) => {
				if (err)
					console.log(err);
				if (order.length <= index + 1) {
					myResolve('done')
				}
			})
		)
	}).then(async value => {
		await req.flash('success', 'Team sorted Successfully');
		res.json(value)
	}, async (err) => {
		await req.flash('error', 'Team sort failed');
		console.log(err)
		res.json(err)

	})
})

router.get('/admin/teams/insert', isloggedin, async (req, res) => {
	db.query('SELECT * FROM teams ORDER', async (err, rows) => {
		if (!err) {
			res.render('./admin/teams/team_insert');
		} else {
			console.log(err);
		}
	});
});

router.post(
	'/admin/teams/insert',
	upload.single('image_team'),
	isloggedin,
	async (req, res) => {
		db.query(
			`INSERT INTO teams (name_team, job_team, email_team, instagram_url, linkedIn_url,  image_team, select_team ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				req.body.name_team,
				req.body.job_team,
				req.body.email_team,
				req.body.instagram_url,
				req.body.linkedIn_url,
				req.file.path,
				req.body.select_team
			],
			async (err, rows) => {
				if (!err) {
					await req.flash('success', 'Team added successfully');
					res.redirect('/admin/teams');
				} else {
					console.log(err);
				}
			}
		);
	}
);

router.get('/admin/teams/:id', isloggedin, (req, res) => {
	db.query(
		'SELECT * FROM teams WHERE id_team = ?',
		[req.params.id],
		(err, rows) => {
			if (!err) {
				res.render('./admin/teams/team_view', { team: rows[0] });
			} else {
				res.status(500).send('Internal server error');
				console.log(err);
			}
		}
	);
});

router.get('/admin/teams/update/:id', isloggedin, async (req, res) => {
	db.query(
		`SELECT * FROM teams WHERE id_team = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				res.render('./admin/teams/team_update', {
					team: rows[0]
				});
			} else {
				console.log(err);
			}
		}
	);
});

router.post(
	'/admin/teams/update/:id',
	isloggedin,
	upload.single('image_team'),
	async (req, res) => {
		console.log(req.body);
		const oldimage = req.body.image_checkbox
			.split('AsteroexResearch/')[1]
			.slice(0, -4);

		db.query(
			`UPDATE teams SET name_team = ?, job_team = ?, email_team = ?, instagram_url = ?, linkedIn_url = ?, select_team = ? , image_team = ? WHERE id_team = ?`,
			[
				req.body.name_team,
				req.body.job_team,
				req.body.email_team,
				req.body.instagram_url,
				req.body.linkedIn_url,
				req.body.select_team,
				req.file ? req.file.path : req.body.image_checkbox,
				req.params.id
			],
			async (err, rows) => {
				if (!err) {
					await cloudinary.uploader.destroy(
						'AsteroexResearch/' + oldimage
					);
					await req.flash('success', 'Team updated successfully');
					res.redirect('/admin/teams');
				} else {
					console.log(err);
				}
			}
		);
	}
);

router.get('/admin/teams/delete/:id', isloggedin, async (req, res) => {
	db.query(
		`DELETE FROM teams WHERE id_team = ?`,
		[req.params.id],
		async (err, rows) => {
			if (!err) {
				await req.flash('success', 'Team deleted successfully');
				res.redirect('/admin/teams');
			} else {
				console.log(err);
			}
		}
	);
});

module.exports = router;
