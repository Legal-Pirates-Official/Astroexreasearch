const express = require("express");
const app = express();
const db = require("../database");

const router = express.Router();

// router.get("/", (req, res) => {
//     res.render("index");
// });

router.get("/about", (req, res) => {
    db.query("SELECT * FROM partners", (err, result) => {
        if (!err) {
            // res.render("about", {partners: result})
            db.query("SELECT * FROM collaborators", (err, result1) => {
                if (!err) {
                    res.render("about", {
                        partners: result,
                        collaborators: result1,
                    });
                } else {
                    res.status(500).send("Internal server error");
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});

// router.get("/events", (req, res) => {
//     res.render("events");
// });

// router.get("/contact", (req, res) => {
//     res.render("contact");
// });

router.get("/partners", (req, res) => {
    res.render("partners");
});

// router.get("/teams", (req, res) => {
//     res.render("teams");
// });

// router.get("/research_areas", (req, res) => {
//     res.render("research_areas");
// });
// router.get("/training", (req, res) => {
//     res.render("training");
// });

module.exports = router;
