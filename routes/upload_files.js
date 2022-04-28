const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/admin/upload_files", isloggedin, (req, res) => {
    db.query("SELECT * FROM upload_files", (err, rows) => {
        if (!err) {
            res.render("./admin/upload/upload_show", {upload_filesArray: rows});
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.get("/admin/upload_files/insert", isloggedin, async (req, res) => {
    db.query("SELECT * FROM upload_files", async (err, rows) => {
        if (!err) {
            res.render("./admin/upload/upload_insert");
        } else {
            console.log(err);
        }
    });
});

module.exports = router;
