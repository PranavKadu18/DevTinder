const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const { ConnectionRequest } = require("../models/connectionReq");
const { createConnection } = require("mongoose");
const { User } = require("../models/user");

const userRouter = express.Router();

const USER_DATA = "firstName lastName gender age profilePhoto bio tags"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const { _id } = req.data;

    const receivedConnectionReq = await ConnectionRequest.find({
      toUserId: _id,
      status: "Intrested",
    }).populate("fromUserId", "firstName lastName profilePhoto");

    if(!receivedConnectionReq)
    {
        return res.json({
            message : "No connection request received yet"
        })
    }

    res.json({
        message : "Received Connection request",
        receivedConnectionReq
    })

  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

userRouter.get("/user/connections",userAuth,async (req,res) => {
    try {
        const loggedinUser = req.data;

        const userConnections = await ConnectionRequest.find({
            $or : [
                {toUserId: loggedinUser._id,status : "Accepted"},
                {fromUserId: loggedinUser._id,status : "Accepted"}
            ]
        })
        .populate("fromUserId",USER_DATA)
        .populate("toUserId",USER_DATA);

        const data = userConnections.map((elem) => {
            if(elem.fromUserId._id.equals(loggedinUser._id))
            {
                return elem.toUserId
            }
            return elem.fromUserId
        })

        if(data.length == 0)
        {
            return res.json({
                message:"No connections"
            })
        }

        res.json({
            message : loggedinUser.firstName + "'s connections",
            data
        })
    } catch (error) {
        res.status(400).send("Error " + error.message)
    }
})

userRouter.get("/user/feed",userAuth,async (req,res) => {
    try {
        const loggedinUser = req.data;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const result = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedinUser._id},
                {fromUserId : loggedinUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideFromFeed = new Set();

        result.forEach((connectionReq) => {
            hideFromFeed.add(connectionReq.fromUserId.toString());
            hideFromFeed.add(connectionReq.toUserId.toString());
        })
        //console.log(hideFromFeed);
        
        const feed = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideFromFeed)}},
                {_id : {$ne : loggedinUser._id}}
            ]
        }).select(USER_DATA)
        .skip(skip)
        .limit(limit)

        res.send(feed);


    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

module.exports = { userRouter };
