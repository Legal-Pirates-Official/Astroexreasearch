const express = require("express");
const app = express();
var QuillDeltaToHtmlConverter =
    require("quill-delta-to-html").QuillDeltaToHtmlConverter;

const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/services", (req, res) => {
    db.query(
        "SELECT * FROM training ORDER BY order_training ASC",
        (err, rows) => {
            if (!err) {
                db.query("SELECT * FROM internship", (err, results) => {
                    if (!err) {
                        db.query("SELECT * FROM services", (err, result2) => {
                            if (!err) {
                                let services = [];

                                result2.forEach((re) => {
                                    var converter =
                                        new QuillDeltaToHtmlConverter(
                                            re.price_services
                                                ? JSON.parse(re.price_services)
                                                      .ops
                                                : [],
                                            {}
                                        );
                                    var html = converter.convert();
                                    services.push({
                                        ...re,
                                        price_services: html,
                                    });
                                });

                                res.render("training", {
                                    training: rows,
                                    internshipArray: results,
                                    services,
                                });
                            } else {
                                res.send(err);
                            }
                        });
                    } else {
                        res.status(500).send("Internal server error");
                        console.log(err);
                    }
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/training", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM training ORDER BY order_training ASC",
        (err, rows) => {
            // console.log(rows);
            if (!err) {
                let trainingArray = [];

                rows.forEach((re) => {
                    var converter = new QuillDeltaToHtmlConverter(
                        re.paragraph_training
                            ? JSON.parse(re.paragraph_training).ops
                            : [],
                        {}
                    );
                    var html = converter.convert();
                    trainingArray.push({ ...re, paragraph_training: html });
                });
                res.render("./admin/training/training_show", {
                    trainingArray,
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/training/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM training", async (err, rows) => {
        if (!err) {
            res.render("./admin/training/training_insert");
        } else {
            console.log(err);
        }
    });
});

router.post("/admin/training/insert", isloggedin, async (req, res) => {
    db.query(
        `INSERT INTO training (title_training, paragraph_training, batch_training) VALUES (?, ?, ?)`,
        [
            req.body.title_training,
            req.body.paragraph_training,
            req.body.batch_training,
        ],
        async (err, rows) => {
            if (!err) {
                res.json("/admin/training");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/training/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM training WHERE id_training = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                let training = [];

                rows.forEach((re) => {
                    var converter = new QuillDeltaToHtmlConverter(
                        re.paragraph_training
                            ? JSON.parse(re.paragraph_training).ops
                            : [],
                        {}
                    );
                    var html = converter.convert();
                    training.push({ ...re, paragraph_training: html });
                });

                res.render("./admin/training/training_view", {
                    training : training[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/training/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM training WHERE id_training = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/training/training_update", {
                    training: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/training/update/para/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT paragraph_training FROM training WHERE id_training = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.json(rows[0]);
            } else {
                console.log(err);
            }
        }
    );
});

router.post("/admin/training/update/:id", isloggedin, async (req, res) => {
    db.query(
        `UPDATE training SET title_training = ?, paragraph_training = ?, batch_training = ?  WHERE id_training = ?`,
        [
            req.body.title_training,
            req.body.paragraph_training,
            req.body.batch_training,
            req.params.id,
        ],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/training");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/training/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM training WHERE id_training = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/training");
            } else {
                console.log(err);
            }
        }
    );
});
router.post("/admin/training/save-sort", async (req, res) => {
    const { order } = req.body;
    new Promise(async (myResolve, myReject) => {
        await order.split(",").forEach(
            async (o, index) =>
                await db.query(
                    "UPDATE training SET order_training = ? WHERE id_training = ?",
                    [index + 1, parseInt(o)],
                    async (err, response) => {
                        if (err) console.log(err);
                        if (order.split(",").length <= index + 1) {
                            myResolve("done");
                        }
                    }
                )
        );
    }).then(
        async (value) => {
            await req.flash("success", "Training sorted Successfully");
            res.json(value);
        },
        async (err) => {
            await req.flash("error", "Training sort failed");
            console.log(err);
            res.json(err);
        }
    );
});

module.exports = router;
