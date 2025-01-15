const express = require("express");
const { connect } = require("./Config/connect");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {validateSignup} = require("./utils/validationSignup")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./Middlewares/auth")

const app = express();

app.use(express.json()); //middleware to convert JSON to JS object
app.use(cookieParser()); //middleware to make cookie readable

app.post("/signup", async (req, res) => {
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

app.post("/login",async (req,res) => {
  try {

    const {email,password} = req.body;

    //validating users email and pass
    if(!validator.isEmail(email))
    {
      throw new Error("Enter a valid Email ID");
    }

    //check if email is present
    const data = await User.findOne({email : email});
    if(!data)
    {
      throw new Error("Email is not registered");
    }

    const check = await bcrypt.compare(password,data.password);

    if(check)
    {
      //create a JWT token
      const token = await jwt.sign({_id : data._id},"8698738044",{expiresIn : "7d"});
      
      //send the cookie
      res.cookie("token",token);
      res.send("User Logged In Successfully")
    }
    else
    {
      res.send("Invalid password");
    }

  } catch (error) {
    res.status(400).send("Error occured while log in " + error);
  }
})

app.get("/profile",userAuth,async (req,res) => {
  try {
    const data = req.data;
    res.send(data);
  } catch (err) {
    res.status(400).send("Error : " + err.message );
  }
})





//first we should connect to db and then listen to any request
connect()
  .then(() => {
    //connect
    console.log("Database connected to the server");
    //then listen
    app.listen(3000, () => {
      console.log("Server is listning to port 3000");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to database");
  });
