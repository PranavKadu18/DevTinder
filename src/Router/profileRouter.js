const {userAuth} = require("../Middlewares/auth");
const express = require("express");
const {User} = require("../models/user")


const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async (req,res) => {
    try {
      const data = req.data;
      res.send(data);
    } catch (err) {
      res.status(400).send("Error : " + err.message );
    }
})

profileRouter.patch("/profile/edit",userAuth,async (req,res) => {
  try {

    const {_id} = req.data;
    const {firstName,lastName,profilePhoto,tags,bio} = req.body;

    const newData = {
      firstName,
      lastName,
      profilePhoto,
      tags,
      bio
    }

    Object.keys(req.body).forEach(key => {
      if(key === 'email') throw new Error("Cant Update Email Id");
      if(key === 'password') throw new Error("Cant Update Password");
    })

    await User.findByIdAndUpdate(_id,newData,{runValidators : true});
    res.send("User Profile Updated Successfully");

  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
})

module.exports = {profileRouter}



  