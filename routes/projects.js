const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/projects", (req, res) => {
    db.query("SELECT * FROM projects", (err, rows) => {
        if (!err) {
            res.render("projects", {projectsArray: rows});
            console.log(rows);
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/publications", (req, res) => {
    db.query("SELECT * FROM projects", (err, rows) => {
        if (!err) {
            res.render("publications", {projectsArray: rows});
            console.log(rows);
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/books", (req, res) => {
    db.query("SELECT * FROM projects", (err, rows) => {
        if (!err) {
            res.render("books", {projectsArray: rows});
            console.log(rows);
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/projects", isloggedin, (req, res) => {
    db.query("SELECT * FROM projects", (err, rows) => {
        if (!err) {
            res.render("./admin/projects/projects_show", {projectsArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/projects/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM projects", async (err, rows) => {
        if (!err) {
            res.render("./admin/projects/projects_insert");
        } else {
            console.log(err);
        }
    });
});

router.post(
    "/admin/projects/insert",
    upload.single("file_projects"),
    isloggedin,
    async (req, res) => {
        db.query(
            `INSERT INTO projects (title_projects, description_projects, file_projects, type_projects ) VALUES (?, ?, ?, ?)`,
            [
                req.body.title_projects,
                req.body.description_projects,
                req.file.path,
                req.body.type_projects,
            ],
            async (err, rows) => {
                if (!err) {
                    res.redirect("/admin/projects");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/projects/:id", isloggedin, (req, res) => {
    db.query(
        "SELECT * FROM projects WHERE id_projects = ?",
        [req.params.id],
        (err, rows) => {
            if (!err) {
                res.render("./admin/projects/projects_view", {
                    projects: rows[0],
                });
            } else {
                res.status(500).send("Internal server error");
                console.log(err);
            }
        }
    );
});

router.get("/admin/projects/update/:id", isloggedin, async (req, res) => {
    db.query(
        `SELECT * FROM projects WHERE id_projects = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.render("./admin/projects/projects_update", {
                    projects: rows[0],
                });
            } else {
                console.log(err);
            }
        }
    );
});

router.post(
    "/admin/projects/update/:id",
    upload.single("file_projects"),
    isloggedin,
    async (req, res) => {
        const oldimage = req.body.image_checkbox
            .split("AsteroexResearch/")[1]
            .slice(0, -4);

        db.query(
            `UPDATE projects SET title_projects = ?, description_projects = ?, file_projects = ?, type_projects = ? WHERE id_projects = ?`,
            [
                req.body.title_projects,
                req.body.description_projects,
                req.file ? req.file.path : req.body.image_checkbox,
                req.body.type_projects,
                req.params.id,
            ],
            async (err, rows) => {
                if (!err) {
                    await cloudinary.uploader.destroy(
                        "AsteroexResearch/" + oldimage
                    );
                    res.redirect("/admin/projects");
                } else {
                    console.log(err);
                }
            }
        );
    }
);

router.get("/admin/projects/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM projects WHERE id_projects = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/projects");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
