const express = require("express");
const app = express();
const db = require("../database");
const path = require("path");

const router = express.Router();

router.get("/admin/footer_contact", (req, res) => {
    db.query("SELECT * FROM footer_contact", (err, rows) => {
        if (!err) {
            res.render("./admin/footer_contact/footer_show", {
                footer_contact: rows[0],
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.post("/admin/footer_contact", (req, res) => {
    console.log(req.body);
    db.query(
        `INSERT INTO footer_contact (email_footer) VALUES (?)`,
        [req.body.email_footer],
        (err, rows) => {
            if (!err) {
                res.redirect("index");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
