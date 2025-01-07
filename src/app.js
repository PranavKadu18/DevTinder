const express = require("express");

const app = express();

app.get("/",(req,res) => {
    res.send("this is main page");
})

app.get("/user",(req,res) => {
    res.send("i am handling user")
})

app.listen(3000,() => {
    console.log("connection established");
})