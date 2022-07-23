const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();


router.get("/admin/collaborators", isloggedin, (req, res) => {
    db.query("SELECT * FROM collaborators", (err, rows) => {
        if (!err) {
            res.render("./admin/collaborators/collaborators_show", { collaboratorsArray: rows });
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


router.post("/admin/collaborators/save-sort", async (req, res) => {
    const { order } = req.body;
    new Promise(async (myResolve, myReject) => {
        await order.split(",").forEach(
            async (o, index) =>
                await db.query(
                    "UPDATE collaborators SET order_collaborators = ? WHERE id_collaborators = ?",
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
            await req.flash("success", "Collaborators sorted Successfully");
            res.json(value);
        },
        async (err) => {
            await req.flash("error", "Collaborators sort failed");
            console.log(err);
            res.json(err);
        }
    );
});


router.post(
    "/admin/collaborators/insert",
    upload.single("image_collaborators"),
    isloggedin,
    async (req, res) => {
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
        const oldimage = req.body.image_checkbox
            .split("AsteroexResearch/")[1]
            .slice(0, -4);


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
                        "AsteroexResearch/" + oldimage
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
