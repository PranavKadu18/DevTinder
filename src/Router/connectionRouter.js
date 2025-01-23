const express = require("express");
const {userAuth} = require("../Middlewares/auth");
const {ConnectionRequest} = require("../models/connectionReq");
const { User } = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.data._id;
        const status = req.params.status;

        //evaluate the data
        //evaluating status 
        const allowedStatus = ["Intrested","Ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                meassage : "Invalid Connection request Status"
            })
        }

        //if A->B is present A->B and B->A should not be allowed 
        const isPresent = await ConnectionRequest.findOne({
            $or : [                                                    //using two querries simultaniously
                {toUserId,fromUserId},
                {toUserId : fromUserId,fromUserId : toUserId}
            ]
        })

        if(isPresent){
            return res.status(400).json({
                message : "Request already exist"
            })
        }

        //Request receiver should be present
        const isReceiver = await User.findById(toUserId);
        if(!isReceiver){
            return res.status(404).json({
                message : "User dont exist"
            })
        }


        const instance = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await instance.save();
        res.json({
            message : "Connection request send successfully",
            data,
        })
        
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }

})


module.exports = {connectionRouter}

