const express = require("express");
const app = express();
const db = require("../database");
const path = require("path");
const {isloggedin} = require("../middleware");
const nodemailer = require("nodemailer");

const router = express.Router();

router.get("/admin/footer_contact", (req, res) => {
    db.query("SELECT * FROM footer_contact", (err, rows) => {
        if (!err) {
            res.render("./admin/footer_contact/footer_show", {
                footer_contactArry: rows,
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.post("/admin/footer_contact/insert", (req, res) => {
    console.log(req.body);
    db.query(
        `INSERT INTO footer_contact (email_footer) VALUES (?)`,
        [req.body.email_footer],
        (err, rows) => {
            if (!err) {
                res.redirect("/");
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/admin/footer_contact/message", (req, res) => {
    db.query("SELECT * FROM footer_contact", (err, rows) => {
        if (!err) {
            res.render("./admin/footer_contact/footer_message", {
                footer_contactArry: rows,
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

router.post("/admin/footer_contact/message", (req, res) => {

    const {allEmails_footer, message_footer} = req.body;
    console.log(req.body);
    // nodemailer

    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.MAIL,
    //         pass: process.env.MAIL_PASSWORD,
    //     },
    // });

    // const mailOptions = {
    //     from: process.env.MAIL,
    //     to: "",
    //     subject: "Message from " + req.body.name,
    //     text: req.body.message,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log("Email sent: " + info.response);
    //     }
    // });
    // res.redirect("/");
});

router.get("/admin/footer_contact/delete/:id", isloggedin, async (req, res) => {
    db.query(
        `DELETE FROM footer_contact WHERE id_footer = ?`,
        [req.params.id],
        async (err, rows) => {
            if (!err) {
                res.redirect("/admin/footer_contact");
            } else {
                console.log(err);
            }
        }
    );
});

module.exports = router;
