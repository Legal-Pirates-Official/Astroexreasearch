const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});

const router = express.Router();

router.get("/research_areas", (req, res) => {
    db.query("SELECT * FROM research_areas", (err, rows) => {
        if (!err) {
            res.render("research_areas", {research_areasArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/research_areas", (req, res) => {
    db.query("SELECT * FROM research_areas", (err, rows) => {
        if (!err) {
            res.render("./admin/research_areas/research_areas_show", {
                research_areasArray: rows,
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/research_areas/insert", async (req, res) => {
    db.query("SELECT * FROM research_areas", async (err, rows) => {
        if (!err) {
            res.render("./admin/research_areas/research_areas_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/research_areas/insert",
    upload.single("image_research_areas"),
    async (req, res) => {
        db.query(
            `INSERT INTO research_areas (text_research_areas, image_research_areas) VALUES (?, ?)`,
            [req.body.text_research_areas, req.file.path],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/research_areas");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/research_areas/:id", (req, res) => {
    db.query(
        "SELECT * FROM research_areas WHERE id_research_areas = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/research_areas/research_areas_view", {
                    research_areas: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/research_areas/update/:id", async (req, res) => {
    db.query(
        `SELECT * FROM research_areas WHERE id_research_areas = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/research_areas/research_areas_update", {
                    research_areas: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/research_areas/update/:id",
    upload.single("image_research_areas"),
    async (req, res) => {
        console.log(req.body);
        const oldimage = req.body.image_checkbox
            .split("Astroex_Research_Association/")[1]
            .slice(0, -4);

        console.log(oldimage);

        db.query(
            `UPDATE research_areas SET text_research_areas = ?, image_research_areas = ? WHERE id_research_areas = ?`,
            [
                req.body.text_research_areas,
                req.file ? req.file.path : req.body.image_checkbox,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "Astroex_Research_Association/" + oldimage
                    );
                    res.redirect("/admin/research_areas");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/research_areas/delete/:id", async (req, res) => {
    console.log(req.query.cloudinaryName);
    db.query(
        `DELETE FROM research_areas WHERE id_research_areas = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/research_areas");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
