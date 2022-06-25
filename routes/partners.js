const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/partners", (req, res) => {
    db.query("SELECT * FROM partners", (err, rows) => {
        if (!err) {
            // console.log(rows);
            res.render("partners", {partnersArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/partners", isloggedin, (req, res) => {
    db.query("SELECT * FROM partners", (err, rows) => {
        if (!err) {
            res.render("./admin/partners/partners_show", {partnersArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/partners/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM partners", async (err, rows) => {
        if (!err) {
            res.render("./admin/partners/partners_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/partners/insert",
    upload.single("image_partners"),
    isloggedin,
    async (req, res) => {
        db.query(
            `INSERT INTO partners (name_partners, image_partners ) VALUES (?, ?)`,
            [req.body.name_partners, req.file.path],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/partners");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/partners/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM partners WHERE id_partners = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/partners/partners_view", {
                    partners: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/partners/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM partners WHERE id_partners = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/partners/partners_update", {
                    partners: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/partners/update/:id",
    upload.single("image_partners"),
    isloggedin,
    async (req, res) => {
        const oldimage = req.body.image_checkbox
            .split("AsteroexResearch/")[1]
            .slice(0, -4);


        db.query(
            `UPDATE partners SET name_partners = ?,  image_partners = ? WHERE id_partners = ?`,
            [
                req.body.name_partners,
                req.file ? req.file.path : req.body.image_checkbox,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "AsteroexResearch/" + oldimage
                    );
                    res.redirect("/admin/partners");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/partners/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM partners WHERE id_partners = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/partners");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
