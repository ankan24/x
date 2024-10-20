const express = require("express");
const sessino = require("express-session");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const login = require("./login.js");
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

const connectDB = mongoose.connect("mongodb://localhost:27017/user");
connectDB
    .then(() => {
        console.log("Connect Successful");
    })
    .catch((err) => {
        console.log("Connection Failed");
    });

app.get("/signup", (req, res) => {
    res.sendFile("login.html", { root: "./public" });
});

app.post("/login", async (req, res) => {
    let n = req.body.name;
    let p = req.body.pwd;

    try {
        const exist = await login.findOne({ name: n });
        if (exist) res.sendFile("/login", { root: "public" });
        let result = new user({
            name: n,
            pwd: p,
        });
        result
            .save()
            .then((ele) => {
                console.log("Data save successfully", ele);
                res.sendFile("./home.html", { root: "public" });
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log(err);
    }
});

app.listen(7070);
