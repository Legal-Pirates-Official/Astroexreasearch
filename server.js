const express = require("express");
const app = express();
require("dotenv").config();

app.listen(`${process.env.LISTENING_PORT}`, () => {
    console.log(`Server is running on port ${process.env.LISTENING_PORT}`);
});
