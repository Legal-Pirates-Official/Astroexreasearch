const mysql = require("mysql");
const express = require("express");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (!err) {
        console.log("MySQL is connected");
    } else {
        console.log("MySQL failed to connect");
        console.log(err);
    }
});

module.exports = db;
