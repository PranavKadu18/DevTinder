const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const payment = express.Router();

payment.post("/payment/create",userAuth,(req,res) ={
    
})

module.exports = { payment };
