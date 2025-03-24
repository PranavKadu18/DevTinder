const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const Chat = require("../models/chat");
const { ConnectionRequest } = require("../models/connectionReq");
const { User } = require("../models/user");
const { differenceInHours, differenceInMinutes, differenceInMonths, differenceInDays } = require("date-fns");

const chatRouter = express.Router();

chatRouter.get("/chats/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.data._id;

    console.log(targetUserId);
    console.log(userId);
    

    //check if sender and receiver of messages are friends
    const isFriend = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: targetUserId, toUserId: userId },
        { fromUserId: userId, toUserId: targetUserId },
      ],
      status: "Accepted",
    });

    console.log(isFriend);
    

    if (!isFriend) {
      return res.status(401).send("Unauthorised request to chat");
    }


    let chat = await Chat.findOne({
      participants: { $all: [targetUserId, userId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [targetUserId, userId],
        messages: [],
      });
    }

    //console.log(chat.messages);

    //getting lastseen time of targetUser
    const {lastSeen} = await User.findById(targetUserId);

    //console.log(lastSeen);
    

    var timediff;

    if(!lastSeen){
        timediff = "....";
    }
    else{
        var min = differenceInMinutes(new Date(),lastSeen);
        var hrs = differenceInHours(new Date(),lastSeen);
        var days = differenceInDays(new Date(),lastSeen);

        if(days > 0){
            timediff = days + " days ago";
        }
        else if(hrs > 0){
            timediff = hrs + " hours ago";
        }
        else if(min > 0){
            timediff = min + " mins ago";
        }
        else{
            timediff = "Online"
        }
    }

    

    res.json({messages:chat.messages,timediff});
    
    
  } catch (error) {
    console.log("Error : " + error.message);
  }
});

module.exports = { chatRouter };
