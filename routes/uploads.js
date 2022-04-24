const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const {isloggedin} = require("../middleware");

const router = express.Router();

router.get("/uploads", (req, res) => {
    res.render("./admin/uploads");
});

router.post("/uploads", (req, res) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file_document;
        var filename = file.name;

        file.mv("/uploads" + filename, (err) => {
            if (err) {
                console.log(err);
                res.send("Error");
            } else {
                res.send("File uploaded");
            }
        });
    }
});

module.exports = router;
