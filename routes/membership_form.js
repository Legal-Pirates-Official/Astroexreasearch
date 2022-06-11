const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.get("/becomeamember", (req, res) => {
    res.render("membership-form");
});

router.post("/becomeamember", (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        auth: {
            user: process.env.MAIL,
            pass: "Latha13087280$#",
        },
    });

    let mailOptions = {
        from: process.env.MAIL,
        to: process.env.MAIL,
        subject: "Message from Astroxresearch",
        text: "Hello world?",
        html: output,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.render("./contact");
    });
});

module.exports = router;
