const mysql = require("mysql");
const express = require("express");
const path = require("path");
const router = express.Router({mergeParams: true});
const multer = require("multer");
const {storage, cloudinary} = require("../cloudinary");
const upload = multer({storage});
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const mysqlConnection = require("../database");

router.get("/register", function (req, res, next) {
    mysqlConnection.query("SELECT * FROM login", (err, rows, fields) => {
        if (!err) {
            res.render("./auth/register", {
                data: rows,
                // , error: req.flash("error")
            });
        } else {
            console.log(err);
        }
    });
});

router.post("/register", async (req, res, next) => {
    const {email, username, password, confirmPassword} = req.body;
    if (!email || !password) {
        // req.flash("error", "Missing email or password!");
        res.redirect("/admin/register");
        // res.status(400).json(`Missing ${!email ? "email" : "password"}!`);
    }
    if (password == confirmPassword) {
        const hash = await bcrypt.hash(password, 10);
        await mysqlConnection.query(
            "INSERT INTO login (email, username, hash) values(?,?,?)",
            [email, username, hash],
            (err, rows, response) => {
                if (!err) {
                    res.redirect("/admin/login");
                } else {
                    console.log(err);
                }
            }
        );
    } else {
        // req.flash("error", "Passwords do not match!");
        res.redirect("/admin/register");
    }
});

router.get("/", function (req, res, next) {
    mysqlConnection.query("SELECT * FROM login", (err, rows, fields) => {
        if (!err) {
            res.render("./auth/login", {data: rows
				// , error: req.flash("error")
			});
        } else {
            console.log(err);
        }
    });
});

router.get("/login", function (req, res, next) {
    mysqlConnection.query("SELECT * FROM login", (err, rows, fields) => {
        if (!err) {
            res.render("./auth/login", {data: rows
				// , error: req.flash("error")
			});
        } else {
            console.log(err);
        }
    });
});

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            // req.flash("error", "Missing username or password!");
            res.redirect("/admin/login");
        }
        mysqlConnection.query(
            `SELECT * FROM login where username = ?`,
            [username],
            async (err, rows, fields) => {
                if (!err) {
                    const user = rows[0];
                    const isMatch = await bcrypt.compare(
                        password,
                        rows[0].hash
                    );
                    if (isMatch) {
                        const loginuser = "Yes";
                        req.session.loginuser = loginuser;
                        res.redirect("/admin/teams");
                    } else {
                        // req.flash("error", "Incorrect password!");
                        res.redirect("/admin/login");
                        // res.status(400).json("Incorrect password");
                    }
                } else {
                    console.log(err);
                }
            }
        );
    } catch (e) {
        // req.flash("error", "Incorrect username or password!");
        console.log(e);
        res.status(400).json("Something broke!");
    }
});

module.exports = router;
