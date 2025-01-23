const express = require("express")
const bcrypt = require("bcrypt");
const validator = require("validator");
const {validateSignup} = require("../utils/validationSignup");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../Middlewares/auth")
const {User} = require("../models/user")

const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
    //we need to create the instance of model to add the data to db
    const { firstName, lastName, email, password } = req.body;
  
    try {
  
      //validating data
      validateSignup(req);
      //encrypting password
      const passwordHash = await bcrypt.hash(password,10);
  
      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
  
  
      await user.save();
      res.send("data saved sucessfully to the db");
  
  
    } catch (error) {
      res.status(400).send("Error occured while sign up " + error);
    }
  
});

  
authRouter.post("/login",async (req,res) => {
    try {
  
      const {email,password} = req.body;
  
      //validating users email and pass
      if(!validator.isEmail(email))
      {
        throw new Error("Enter a valid Email ID");
      }
  
      //check if email is present
      const data = await User.findOne({email : email});           //this data is also an intance of model User
      if(!data)
      {
        throw new Error("Email is not registered");
      }
  
      const check = await data.checkPass(password);
  
      if(check)
      {
        //create a JWT token
        const token = await data.getJWT();                 //using the instance of model we are calling the schema meathod
        
        //send the cookie
        res.cookie("token",token);
        res.send("User Logged In Successfully")
      }
      else
      {
        res.status(400).send("Invalid password");
      }
  
    } catch (error) {
      res.status(400).send("Error occured while log in " + error);
    }
})


authRouter.get("/logout",userAuth,(req,res) => {
    try {
      res.clearCookie('token');
      res.send("User Logged out successfully");
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
})

authRouter.patch("/forgotPassword",async (req,res) => {
  try {
    const {email,password} = req.body;
    const userEmail = email;
    const newPassword = password;

    validateSignup(req);

    const result = await User.findOne({email : userEmail});
    if(!result)
    {
      throw new Error("You dont have an account Try to create it first");
    }

    const hash = await bcrypt.hash(newPassword,10);
    result.password = hash;
    const saved = await result.save();
    console.log(saved);
    

    if(!saved) {
      throw new Error("Try again");
    }

    res.send("Password changed Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message)
  }

})

module.exports = {authRouter}