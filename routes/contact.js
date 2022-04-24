const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.post("/contact", (req, res) => {
    console.log(req.body);
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
        service: "gmail",
        auth: {
            user: "geniuscriminaloffical@gmail.com",
            pass: "Latha13087280$#",
        },
    });

    let mailOptions = {
        from: "geniuscriminaloffical@gmail.com",
        to: "geniuscriminaloffical@gmail.com",
        subject: "Customer Contact Request",
        text: "Hello world?",
        html: output,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.render("./contact", {msg: "Email has been sent"});
    });
});

module.exports = router;
