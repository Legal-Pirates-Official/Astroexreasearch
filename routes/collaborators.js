const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();


router.get("/admin/collaborators", isloggedin, (req, res) => {
    db.query("SELECT * FROM collaborators", (err, rows) => {
        if (!err) {
            res.render("./admin/collaborators/collaborators_show", {collaboratorsArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/collaborators/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM collaborators", async (err, rows) => {
        if (!err) {
            res.render("./admin/collaborators/collaborators_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/collaborators/insert",
    upload.single("image_collaborators"),
    isloggedin,
    async (req, res) => {
        console.log(req.body);
        db.query(
            `INSERT INTO collaborators (name_collaborators, image_collaborators ) VALUES (?, ?)`,
            [req.body.name_collaborators, req.file.path],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/collaborators");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/collaborators/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM collaborators WHERE id_collaborators = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/collaborators/collaborators_view", {
                    collaborators: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/collaborators/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM collaborators WHERE id_collaborators = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/collaborators/collaborators_update", {
                    collaborators: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/collaborators/update/:id",
    upload.single("image_collaborators"),
    isloggedin,
    async (req, res) => {
        console.log(req.body);
        const oldimage = req.body.image_checkbox
            .split("Astroex_Research_Association/")[1]
            .slice(0, -4);

        console.log(oldimage);

        db.query(
            `UPDATE collaborators SET name_collaborators = ?,  image_collaborators = ? WHERE id_collaborators = ?`,
            [
                req.body.name_collaborators,
                req.file ? req.file.path : req.body.image_checkbox,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "Astroex_Research_Association/" + oldimage
                    );
                    res.redirect("/admin/collaborators");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/collaborators/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM collaborators WHERE id_collaborators = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/collaborators");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;