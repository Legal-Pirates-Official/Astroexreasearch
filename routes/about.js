const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/about", (req, res) => {
    db.query("SELECT * FROM partners", (err, result) => {
        if (!err) {
            db.query("SELECT * FROM collaborators", (err, result1) => {
                if (!err) {
                    db.query("SELECT * FROM services", (err, result2) => {
                        if (!err) {
                            res.render("about", {
                                partners: result,
                                collaborators: result1,
                                services: result2,
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
            console.log(err);
        }
    });
});

// router.get("/services", (req, res) => {
//     db.query("SELECT * FROM services", (err, rows) => {
//         if (!err) {
//             res.render("services", { servicesArray: rows });
//         } else {
//             res.status(500).send("Internal server error");
//             console.log(err);
//         }
//     });
// });

router.get("/admin/services", isloggedin, (req, res) => {
    db.query("SELECT * FROM services ORDER BY order_services desc", (err, rows) => {
        if (!err) {
            res.render("./admin/services/services_show", {
                servicesArray: rows,
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/services/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM services ORDER BY order_services desc", async (err, rows) => {
        if (!err) {
            res.render("./admin/services/services_insert");
        } else {
            console.log(err);
        }
    });
});

router.post("/admin/services/save-sort", async (req, res) => {
    const { order } = req.body;

    new Promise(async (myResolve, myReject) => {
        await order.split(",").forEach(
            async (o, index) => {
                await db.query(
                    "UPDATE services SET order_services = ? WHERE services_id = ?",
                    [index + 1, parseInt(o)],
                    async (err, response) => {
                        if (err) console.log(err);
                        if (order.split(",").length <= index + 1) {
                            myResolve("done");
                        }
                    }
                )
            }
        );
    }).then(
        async (value) => {
            await req.flash("success", "Services sorted Successfully");
            res.json(value);
        },
        async (err) => {
            await req.flash("error", "Services sort failed");
            console.log(err);
            res.json(err);
        }
    );
});


router.post("/admin/services/insert", isloggedin, async (req, res) => {
    db.query(
        `INSERT INTO services (name_services, textarea_services) VALUES (?, ?)`,
        [req.body.name_services, req.body.textarea_services],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/services");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/services/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM services WHERE services_id = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/services/services_view", {
                    servicesArray: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/services/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM services WHERE services_id = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/services/services_update", {
                    servicesArray: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post("/admin/services/update/:id", isloggedin, async (req, res) => {
    db.query(
        `UPDATE services SET name_services = ?,  textarea_services = ? WHERE services_id = ?`,
        [req.body.name_services, req.body.textarea_services, req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/services");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/services/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM services WHERE services_id = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/services");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
