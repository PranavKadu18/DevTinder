const express = require("express");
const {userAuth} = require("../Middlewares/auth");
const {ConnectionRequest} = require("../models/connectionReq");

const userRouter = express.Router();

userRouter.get("/user/received/request",userAuth,async (req,res) => {
    try {
        const {_id} = req.data;

        const receivedRequest = await ConnectionRequest.find({toUserId : _id,status:"Intrested"});
        if(!receivedRequest)
        {
            return res.json({
                message : "No request yet"
            })
        }

        res.json({
            message : "Your Requests",
            receivedRequest
        })
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
})

module.exports = {userRouter}