const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const { ConnectionRequest } = require("../models/connectionReq");

const userRouter = express.Router();

const USER_DATA = "firstName lastName profilePhoto bio"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const { _id } = req.data;

    const receivedConnectionReq = await ConnectionRequest.find({
      toUserId: _id,
      status: "Intrested",
    }).populate("fromUserId", "firstName lastName");

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

module.exports = { userRouter };
