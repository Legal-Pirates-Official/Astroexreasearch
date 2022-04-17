const express = require("express");
const app = express();

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/events", (req, res) => {
    res.render("events");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.get("/partners", (req, res) => {
    res.render("partners");
});

// router.get("/teams", (req, res) => {
//     res.render("teams");
// });

router.get("/research_areas", (req, res) => {
    res.render("research_areas");
});
// router.get("/training", (req, res) => {
//     res.render("training");
// });



module.exports = router;
