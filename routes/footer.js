const express = require("express");
const app = express();
const db = require("../database");
const path = require("path");

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

router.post("/admin/footer_contact", (req, res) => {
    console.log(req.body);
    db.query(
        `INSERT INTO footer_contact (email_footer) VALUES (?)`,
        [req.body.email_footer],
        (err, rows) => {
            if (!err) {
                res.redirect("index");
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

router.post("admin/footer_contact/message", (req, res) => {
    db.query("SELECT * FROM footer_contact", (err, rows) => {
        if (!err) {
            const output = `
                <p>You have a new contact request</p>
                <h3>Contact Details</h3>
                <h3>Message</h3>
                <p>${req.body.message_footer}</p>
                `;

            let transporter = nodemailer.createTransport({
                // port: 587,
                // secure: false,
                service: "gmail",
                auth: {
                    user: "",
                    pass: "",
                },
            });

            let mailOptions = {
                from: "",
                to: "",
                subject: "Customer Contact Request",
                text: "Hello world?",
                html: output,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.redirect("/admin/footer_contact");
            });
        } else {
            res.status(500).send("Internal server error");
            console.log(err);
        }
    });
});

module.exports = router;
