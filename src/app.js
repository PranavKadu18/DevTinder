const express = require("express");
const {adminAuth,userAuth} = require("../utils/auth");

const app = express();


app.get("/user",(req,res,next) => {
    try {
        throw new Error("fskhsfdfs");
        res.send("user")
    } catch (error) {
        res.status(500).send("unexpected error occured");   
    }
})

// app.use("/",(err,req,res,next) => {
//     if(err){
//         res.status(500).send("unexpected error occured");
//     }
// })


app.listen(3000, () => {
  console.log("connection established");
});
