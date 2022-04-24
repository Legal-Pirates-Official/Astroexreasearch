const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ejs = require("ejs");
const path = require("path");
const upload = require("express-fileupload");

// routes

const home = require("./routes/home");
const login = require("./routes/login");
const teams = require("./routes/teams");
const training = require("./routes/training");
const simple = require("./routes/simple");
const contact = require("./routes/contact");
const footer = require("./routes/footer");
const partners = require("./routes/partners");
const collaborators = require("./routes/collaborators");
const projects = require("./routes/projects");
const events = require("./routes/events");
const research_areas = require("./routes/research_areas");
const internship = require("./routes/internship");
const uploads = require("./routes/uploads");

app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

require("dotenv").config();

app.use(upload());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/", simple);
app.use("/", home);
app.use("/admin", login);
app.use("/", teams);
app.use("/", training);
app.use("/", contact);
app.use("/", footer);
app.use("/", partners);
app.use("/", collaborators);
app.use("/", projects);
app.use("/", events);
app.use("/", research_areas);
app.use("/", internship);
app.use("/", uploads);

app.get("*", (req, res) => {
    res.render("404");
});

app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
