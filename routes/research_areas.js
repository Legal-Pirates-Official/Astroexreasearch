const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/research_areas", (req, res) => {
    db.query("SELECT * FROM research_areas ORDER BY order_research_areas desc", (err, rows) => {
        if (!err) {
            res.render("research_areas", { research_areasArray: rows });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/research_areas", isloggedin, (req, res) => {
    db.query("SELECT * FROM research_areas ORDER BY order_research_areas desc", (err, rows) => {
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

router.get("/admin/research_areas/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM research_areas ORDER BY order_research_areas desc", async (err, rows) => {
        if (!err) {
            res.render("./admin/research_areas/research_areas_insert");
        } else {
            console.log(err);
        }
    });
});

router.post("/admin/research_areas/save-sort", async (req, res) => {
    const { order } = req.body;
    new Promise(async (myResolve, myReject) => {
        await order.split(",").forEach(
            async (o, index) =>
                await db.query(
                    "UPDATE research_areas SET order_research_areas = ? WHERE id_research_areas = ?",
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
            await req.flash("success", "Research areas sorted Successfully");
            res.json(value);
        },
        async (err) => {
            await req.flash("error", "Research areas sort failed");
            console.log(err);
            res.json(err);
        }
    );
});


router.post("/admin/research_areas/insert", isloggedin, async (req, res) => {
    db.query(
        `INSERT INTO research_areas (text_research_areas) VALUES (?)`,
        [req.body.text_research_areas],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/research_areas");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/research_areas/:id", isloggedin, (req, res) => {
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

router.get("/admin/research_areas/update/:id", isloggedin, async (req, res) => {
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
    isloggedin,
    async (req, res) => {

        db.query(
            `UPDATE research_areas SET text_research_areas = ? WHERE id_research_areas = ?`,
            [req.body.text_research_areas, req.params.id],
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

router.get("/admin/research_areas/delete/:id", isloggedin, async (req, res) => {
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
