const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/internship", (req, res) => {
    db.query(
        "SELECT * FROM internship ORDER BY order_internship",
        (err, rows) => {
            if (!err) {
                db.query(
                    "SELECT * FROM training ORDER BY order_training",
                    (err, row) => {
                        if (!err) {
                            let training = []

                            row.forEach(r => {
                                var converter = new QuillDeltaToHtmlConverter(r.paragraph_training ? JSON.parse(r.paragraph_training).ops : [], {});
                                var html = converter.convert();
                                training.push({ ...r, paragraph_training: html })
                            })


                            res.render("internship", {
                                training,
                                internshipArray: rows,
                            });
                        } else {
                            res.send(err);
                        }
                    }
                );
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/internship/:search", isloggedin, (req, res) => {
    const search = req.params.search;
    db.query(`SELECT * FROM internship`, (err, rows) => {
        if (!err) {
            let internshipArray = [];
            rows.forEach((element) => {
                console.log(
                    element.heading_internship
                        .toLowerCase()
                        .includes(search.toLowerCase())
                );
                if (element.heading_internship.toLowerCase().includes(search)) {
                    internshipArray.push(element);
                }
            });
            res.render("./internship", { internshipArray });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/internship", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM internship ORDER BY order_internship",
        (err, rows) => {
            if (!err) {
                res.render("./admin/internship/internship_show", {
                    internshipArray: rows,
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/internship/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM internship", async (err, rows) => {
        if (!err) {
            res.render("./admin/internship/internship_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/internship/insert",
    upload.single("image_internship"),
    isloggedin,
    async (req, res) => {
        // let data;

        // Object.keys(req.body).forEach((key, index) => {
        //     if (key.includes("tag_internship")) {
        //         data = !data
        //             ? `${key}=${req.body[key]},`
        //             : Object.keys(req.body).length - 1 == index
        //             ? data + `${key}=${req.body[key]}`
        //             : data + `${key}=${req.body[key]},`;
        //     }
        // });

        await db.query(
            `INSERT INTO internship (heading_internship, subheading_internship, description_internship, form_internship, image_internship, phone_internship, email_internship) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                req.body.heading_internship,
                req.body.subheading_internship,
                req.body.description_internship,
                req.body.form_internship,
                req.file.path,
                req.body.phone_internship,
                req.body.email_internship,
                // data,
            ],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/internship");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/internship/:id", isloggedin, (req, res) => {
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

router.get("/admin/internship/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM internship WHERE id_internship = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                // const taglines = rows[0].tag_internship.split(",");
                // const tagArray = [];
                // taglines.forEach((element) => {
                //     const tag = element.split("=")[1];
                //     tagArray.push(tag);
                // });
                res.render("./admin/internship/internship_update", {
                    internship: rows[0],
                    // tag_internship: tagArray,
                    // tag_length: tagArray.length,
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/internship/update/:id",
    upload.single("image_internship"),
    isloggedin,
    async (req, res) => {
        const oldimage = req.body.image_checkbox
            .split("AsteroexResearch/")[1]
            .slice(0, -4);
        let data;

        Object.keys(req.body).forEach((key, index) => {
            if (key.includes("tag_internship")) {
                data = !data
                    ? `${key}=${req.body[key]},`
                    : Object.keys(req.body).length - 1 == index
                        ? data + `${key}=${req.body[key]}`
                        : data + `${key}=${req.body[key]},`;
            }
        });

        db.query(
            `UPDATE internship SET heading_internship = ?, subheading_internship = ?, description_internship = ?, form_internship = ?, image_internship = ? , phone_internship = ?, email_internship = ? WHERE id_internship = ?`,
            [
                req.body.heading_internship,
                req.body.subheading_internship,
                req.body.description_internship,
                req.body.form_internship,
                req.file ? req.file.path : req.body.image_checkbox,
                req.body.phone_internship,
                req.body.email_internship,
                // data,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "AsteroexResearch/" + oldimage
                    );
                    res.redirect("/admin/internship");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/internship/delete/:id", isloggedin, async (req, res) => {
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

router.post("/admin/internship/save-sort", async (req, res) => {
    const { order } = req.body;
    new Promise(async (myResolve, myReject) => {
        await order.split(",").forEach(
            async (o, index) =>
                await db.query(
                    "UPDATE internship SET order_internship = ? WHERE id_internship = ?",
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
            await req.flash("success", "Internship sorted Successfully");
            res.json(value);
        },
        async (err) => {
            await req.flash("error", "Internship sort failed");
            console.log(err);
            res.json(err);
        }
    );
});

module.exports = router;
