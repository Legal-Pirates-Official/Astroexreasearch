const express = require("express");
const app = express();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const { isloggedin } = require("../middleware");

const router = express.Router();

router.get("/admin/membership", isloggedin, (req, res) => {
    res.render("./admin/membership/membership_show");
});

router.get("/admin/membership/insert", isloggedin, (req, res) => {
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

    res.render("./admin/membership/membership_insert");
});

module.exports = router;
