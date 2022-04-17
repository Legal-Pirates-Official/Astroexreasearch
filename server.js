const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const path = require("path");

// routes

const teams = require("./routes/teams");
const training = require("./routes/training");
const simple = require("./routes/simple");
const contact = require("./routes/contact");
const footer = require("./routes/footer");
const partners = require("./routes/partners");
const events = require("./routes/events");
const research_areas = require("./routes/research_areas");

app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

require("dotenv").config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/", simple);
app.use("/", teams);
app.use("/", training);
app.use("/", contact);
app.use("/", footer);
app.use("/", partners);
app.use("/", events);
app.use("/", research_areas);

app.listen(`${process.env.LISTENING_PORT}`, () => {
    console.log(`Server is running on port ${process.env.LISTENING_PORT}`);
});