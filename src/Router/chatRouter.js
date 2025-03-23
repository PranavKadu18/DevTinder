const express = require("express");
const { userAuth } = require("../Middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chats/:targetUserId",userAuth,async (req,res) => {
    const {targetUserId} = req.params;
    const userId = req.data._id;

    let chat = await Chat.findOne({
        participants : { $all : [targetUserId,userId] }
    }).populate({
        path : "messages.senderId",
        select : "firstName lastName"
    })

    if(!chat){
        chat = new Chat({
            participants : [targetUserId,userId],
            messages : []
        })
    }

    //console.log(chat.messages);
    

    res.json(chat.messages)

    
})

module.exports = { chatRouter };