const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/membership", async (req, res) => {
    try {
        await db.query("SELECT * FROM membership", async (err, results) => {
            if (err) throw err;
            const para = results[0];
            await db.query(
                "SELECT * FROM membership_table1",
                async (err, results1) => {
                    if (err) throw err;
                    const table1 = results1;
                    await db.query(
                        "SELECT * FROM membership_table2",
                        async (err, results2) => {
                            if (err) throw err;
                            const table2 = results2;
                            await res.render("membership", {
                                para,
                                table1,
                                table2,
                            });
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership", isloggedin, async (req, res) => {
    try {
        await db.query("SELECT * FROM membership", async (err, results) => {
            if (err) throw err;
            const para = results[0];
            await db.query(
                "SELECT * FROM membership_table1",
                async (err, results1) => {
                    if (err) throw err;
                    const table1 = results1;
                    await db.query(
                        "SELECT * FROM membership_table2",
                        async (err, results2) => {
                            if (err) throw err;
                            const table2 = results2;
                            await res.render(
                                "./admin/membership/membership_show",
                                {
                                    para,
                                    table1,
                                    table2,
                                }
                            );
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/insert", isloggedin, async (req, res) => {
    let data;

    Object.keys(req.body).forEach((key, index) => {
        if (key.includes("tag_membership")) {
            data = !data
                ? `${key}=${req.body[key]},`
                : Object.keys(req.body).length - 1 == index
                ? data + `${key}=${req.body[key]}`
                : data + `${key}=${req.body[key]},`;
        }
    });

    try {
        await db.query("SELECT * FROM membership", async (err, results) => {
            if (err) throw err;
            const para = results[0];
            await db.query(
                "SELECT * FROM membership_table1",
                async (err, results1) => {
                    if (err) throw err;
                    const table1 = results1;
                    await db.query(
                        "SELECT * FROM membership_table2",
                        async (err, results2) => {
                            if (err) throw err;
                            const table2 = results2;
                            await res.render(
                                "./admin/membership/membership_insert",
                                {
                                    para,
                                    table1,
                                    table2,
                                }
                            );
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/para", async (req, res) => {
    try {
        await db.query(`SELECT * FROM membership`, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
        console.log(data);
    } catch (err) {
        console.log(err);
    }
});

router.post("/admin/membership/para", async (req, res) => {
    console.log(req.body.para);
    try {
        await db.query(
            "UPDATE membership SET paragraph = ? where membership_id = ?",
            [req.body.paragraph, 1],
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

router.post("/admin/membership/para/delete", async (req, res) => {
    try {
        await db.query(
            "DELETE FROM membership where membership_id = ?",
            [req.body.membership_id],
            req.body,
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/table1", async (req, res) => {
    try {
        await db.query(`SELECT * FROM membership_table1`, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
        console.log(data);
    } catch (err) {
        console.log(err);
    }
});

router.post("/admin/membership/table1", async (req, res) => {
    try {
        await db.query(
            "INSERT INTO membership_table1 SET ?",
            req.body,
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/table1/:id/delete", async (req, res) => {
    try {
        console.log(req.params.id);

        await db.query(
            "DELETE FROM membership_table1 where membership_table1_id = ?",
            [req.params.id],
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/table2", async (req, res) => {
    try {
        await db.query(`SELECT * FROM membership_table2`, (err, result) => {
            if (err) throw err;
            res.redirect("/admin/membership/insert");
        });
        console.log(data);
    } catch (err) {
        console.log(err);
    }
});

router.post("/admin/membership/table2", async (req, res) => {
    try {
        await db.query(
            "INSERT INTO membership_table2 SET ?",
            req.body,
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

router.get("/admin/membership/table2/:id/delete", async (req, res) => {
    try {
        await db.query(
            "DELETE FROM membership_table2 where membership_table2_id = ?",
            [req.params.id],
            (err, result) => {
                if (err) throw err;
                res.redirect("/admin/membership/insert");
            }
        );
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
