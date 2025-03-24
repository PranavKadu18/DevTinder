const { Server } = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const { format } = require("date-fns");
const { ConnectionRequest } = require("../models/connectionReq");
const { User } = require("../models/user");

const getRoomId = ({ targetUserId, userId }) => {
  return crypto
    .createHash("sha256")
    .update([targetUserId, userId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    //creting a server to handle the websockets using the http server
    cors: {
      origin: "http://localhost:5173", //here in options we use cors to validate out ip and port as its the same server
    },
  });

  io.on("connection",(socket) => {
    socket.on("joinChat", async ({ targetUserId, userId, senderName }) => {
      //create a room as they join chat
      const roomId = getRoomId({ targetUserId, userId });

      //console.log(senderName + " joined the room " + roomId);
      socket.join(roomId);

      const result = await User.findByIdAndUpdate(userId,{lastSeen : new Date()});
    });

    socket.on(
      "sendMessage",
      async ({ text, senderName, targetUserId, userId }) => {
        try {
          //check if sender and receiver of messages are friends
          const isFriend = await ConnectionRequest.findOne({
            $or: [
              { fromUserId: targetUserId, toUserId: userId },
              { fromUserId: userId, toUserId: targetUserId },
            ],
            status : "Accepted"
          });

          if(!isFriend){
            throw new Error("Unauthorised request to chat");
          }

          //console.log(senderName + " : " + text);
          const roomId = getRoomId({ targetUserId, userId });

          //store message in database
          let chat = await Chat.findOne({
            participants: { $all: [targetUserId, userId] },
          });

          //console.log("1 : " + chat);

          //if chat is not present ie they are chatting for first time create a chat document
          if (!chat) {
            //if no existing chat create one
            chat = new Chat({
              participants: [targetUserId, userId],
              messages: [],
            });

            //console.log("2 : " + chat);
          }

          const time = format(new Date(), "HH:mm:ss");

          //if present else not tari pan msg store kar nsel tar var banlay
          chat.messages.push({ senderId: userId, text, time });

          //save in db
          await chat.save();

          io.send(roomId).emit("receiveMessage", {
            text,
            senderName,
            time,
            senderId: userId,
          });
        } catch (error) {
          console.log("Error : " + error.message);
        }
      }
    );
  });
};

module.exports = {
  initializeSocket,
};
