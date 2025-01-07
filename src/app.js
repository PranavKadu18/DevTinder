const express = require("express");

const app = express();

app.get("/user",(req,res) => {
    //get the data from data base
    res.send("got the data of the users");
})

app.get("/user/1",(req,res) => {
    res.send("got the data from the first user");
})

app.post("/user",(req,res) => {
    //post data
    res.send("data for user posted sucessfully");
})

app.delete("/user",(req,res) => {
    //post data
    res.send("data for user deleted sucessfully");
})

app.put("/user",(req,res) => {
    res.send("data is updated by replacement");
})

app.listen(3000,() => {
    console.log("connection established");
})