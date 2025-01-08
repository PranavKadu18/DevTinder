const express = require("express");
const {adminAuth,userAuth} = require("../utils/auth");

const app = express();


//only admin can perform these operations so we need to authenticate if the request is made by actual admin
//this is done by using key
//same was the reason why we used the key in tmdb project


//instead of writing this auth logic twice we can write it in middleware to increase reusablity

app.use("/admin",adminAuth);

app.get("/user",userAuth,(req,res,next) => {
    //logic to get all data of user
    res.send("data of users");
})

app.get("/admin/getdata",(req,res,next) => {
    //logic to get all data
    res.send("got all data");
})

app.delete("/admin/deletedata",(req,res,next) => {
    //logic to delete the data
    res.send("all data deleted")
})


app.listen(3000, () => {
  console.log("connection established");
});
