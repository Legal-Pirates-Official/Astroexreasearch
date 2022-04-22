const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/teams", (req, res) => {
    db.query("SELECT * FROM teams", (err, rows) => {
        if (!err) {
            res.render("teams", {teamArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/teams", isloggedin, (req, res) => {
    db.query("SELECT * FROM teams", (err, rows) => {
        if (!err) {
            res.render("./admin/teams/team_show", {teamArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/teams/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM teams", async (err, rows) => {
        if (!err) {
            res.render("./admin/teams/team_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/teams/insert",
    upload.single("image_team"),
    isloggedin,
    async (req, res) => {
        db.query(
            `INSERT INTO teams (name_team, job_team, email_team, instagram_url, linkedIn_url, color_team, image_team, select_team ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.body.name_team,
                req.body.job_team,
                req.body.email_team,
                req.body.instagram_url,
                req.body.linkedIn_url,
                req.body.color_team,
                req.file.path,
                req.body.select_team,
            ],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/teams");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/teams/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM teams WHERE id_team = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/teams/team_view", {team: rows[0]});
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/teams/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM teams WHERE id_team = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/teams/team_update", {
                    team: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/teams/update/:id",
    isloggedin,
    upload.single("image_team"),
    async (req, res) => {
        console.log(req.body);
        // https://res.cloudinary.com/dn3s6sgki/image/upload/v1650037728/Astroex_Research_Association/ac37qkdbythvpck0a2lk.png
        const oldimage = req.body.image_checkbox
            .split("Astroex_Research_Association/")[1]
            .slice(0, -4);

        console.log(oldimage);

        db.query(
            `UPDATE teams SET name_team = ?, job_team = ?, email_team = ?, instagram_url = ?, linkedIn_url = ?, color_team = ?, select_team = ? , image_team = ? WHERE id_team = ?`,
            [
                req.body.name_team,
                req.body.job_team,
                req.body.email_team,
                req.body.instagram_url,
                req.body.linkedIn_url,
                req.body.color_team,
                req.body.select_team,
                req.file ? req.file.path : req.body.image_checkbox,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "Astroex_Research_Association/" + oldimage
                    );
                    res.redirect("/admin/teams");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/teams/delete/:id", isloggedin, async (req, res) => {
    console.log(req.query.cloudinaryName);
    db.query(
        `DELETE FROM teams WHERE id_team = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/teams");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
