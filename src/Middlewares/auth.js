const jwt = require("jsonwebtoken")
const {User} = require("../models/user")

const userAuth = async (req,res,next) => {
   try {
        //get the token and verify it
        const {token} = req.cookies;

        if(!token)
        {
            throw new Error("Try to Log in first");
        }

        const decodeObj = await jwt.verify(token,"8698738044");
        const {_id} = decodeObj;

        const data = await User.findById(_id);

        if(!data)
        {
            throw new Error("You dont have any account");
        }
        //token is valid we can proceed
        console.log(data);
        
        req.data = data;
        next();
   } catch (error) {
        res.status(400).send("Error : " + error.message);
   }
}

module.exports = {
    userAuth
}