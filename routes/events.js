const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/events", (req, res) => {
    db.query("SELECT * FROM events", (err, rows) => {
        if (!err) {
            res.render("events", {eventsArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/events", isloggedin, (req, res) => {
    db.query("SELECT * FROM events", (err, rows) => {
        if (!err) {
            res.render("./admin/events/events_show", {eventsArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/events/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM events", async (err, rows) => {
        if (!err) {
            res.render("./admin/events/events_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/events/insert",
    upload.single("image_events"),
    isloggedin,
    async (req, res) => {
        db.query(
            `INSERT INTO events (name_events, description_events, date_events, time_events, image_events) VALUES (?, ?, ?, ?, ?)`,
            [
                req.body.name_events,
                req.body.description_events,
                req.body.date_events,
                req.body.time_events,
                req.file.path,
            ],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/events");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/events/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM events WHERE id_events = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/events/events_view", {events: rows[0]});
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/events/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM events WHERE id_events = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/events/events_update", {
                    events: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/events/update/:id",
    upload.single("image_events"),
    isloggedin,
    async (req, res) => {
        console.log(req.body);
        const oldimage = req.body.image_checkbox
            .split("Astroex_Research_Association/")[1]
            .slice(0, -4);

        console.log(oldimage);

        db.query(
            `UPDATE events SET name_events = ?, description_events = ?, date_events = ?, time_events = ?, image_events = ? WHERE id_events = ?`,
            [
                req.body.name_events,
                req.body.description_events,
                req.body.date_events,
                req.body.time_events,
                req.file ? req.file.path : req.body.image_checkbox,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "Astroex_Research_Association/" + oldimage
                    );
                    res.redirect("/admin/events");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/events/delete/:id", isloggedin, async (req, res) => {
    console.log(req.query.cloudinaryName);
    db.query(
        `DELETE FROM events WHERE id_events = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/events");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
