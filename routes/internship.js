const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});

const router = express.Router();

router.get("/internship", (req, res) => {
    db.query("SELECT * FROM internship", (err, rows) => {
        if (!err) {
            res.render("internship", {internshipArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/internship", (req, res) => {
    db.query("SELECT * FROM internship", (err, rows) => {
        if (!err) {
            res.render("./admin/internship/internship_show", {
                internshipArray: rows,
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/internship/insert", async (req, res) => {
    db.query("SELECT * FROM internship", async (err, rows) => {
        if (!err) {
            res.render("./admin/internship/internship_insert");
        } else {
            console.log(err);
        }
    });
});

router.post("/admin/internship/insert", async (req, res) => {
    console.log(req.body);
    db.query(
        `INSERT INTO internship (heading_internship, subheading_internship, description_internship, tag_internship) VALUES (?, ?, ?, ?)`,
        [
            req.body.heading_internship,
            req.body.subheading_internship,
            req.body.description_internship,
            req.body.tag_internship,
        ],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/internship");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/internship/:id", (req, res) => {
    db.query(
        "SELECT * FROM internship WHERE id_internship = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/internship/internship_view", {
                    internship: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/internship/update/:id", async (req, res) => {
    db.query(
        `SELECT * FROM internship WHERE id_internship = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/internship/internship_update", {
                    internship: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post("/admin/internship/update/:id", async (req, res) => {
    console.log(req.body);
    db.query(
        `UPDATE internship SET heading_internship = ?, subheading_internship = ?, description_internship = ? , tag_internship = ?  WHERE id_internship = ?`,
        [
            req.body.heading_internship,
            req.body.subheading_internship,
            req.body.description_internship,
            req.body.tag_internship,
            req.params.id,
        ],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/internship");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/internship/delete/:id", async (req, res) => {
    db.query(
        `DELETE FROM internship WHERE id_internship = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/internship");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
