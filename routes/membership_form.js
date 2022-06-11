const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require("dotenv").config();
const db = require("../database");

const router = express.Router();

router.get("/becomeamember", (req, res) => {
    res.render("membership-form");
});

router.post("/becomeamember/insert", async (req, res) => {
    // const output = `
    // <p>You have a new contact request</p>
    // <h3>Contact Details</h3>
    // <ul>
    //     <li>Name: ${req.body.name}</li>
    //     <li>Email: ${req.body.email}</li>
    // </ul>
    // <h3>Message</h3>
    // <p>${req.body.message}</p>
    // `;

    // let transporter = nodemailer.createTransport({
    //     service: "Gmail",
    //     host: "smtp.gmail.com",
    //     auth: {
    //         user: process.env.MAIL,
    //         pass: "Latha13087280$#",
    //     },
    // });

    // let mailOptions = {
    //     from: process.env.MAIL,
    //     to: process.env.MAIL,
    //     subject: "Message from Astroxresearch",
    //     text: "Hello world?",
    //     html: output,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     res.render("./contact");
    // });

    await db.query(
        "INSERT INTO membership_join SET ?",
        [req.body],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/becomeamember");
            }
        }
    );
});

router.get("/admin/becomeamember_show", async (req, res) => {
    await db.query("SELECT * FROM membership_join", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("./admin/membership_form/membership_form_show.ejs", {
                membership_join: result,
            });
        }
    });
});

router.get("/admin/becomeamember/delete/:id", async (req, res) => {
    await db.query(
        "DELETE FROM membership_join WHERE membership_join_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/admin/becomeamember_show");
            }
        }
    );
});

module.exports = router;
