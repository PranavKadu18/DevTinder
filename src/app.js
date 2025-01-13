const express = require("express");
const { connect } = require("./Config/connect");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {validateSignup} = require("./utils/validationSignup")

const app = express();

app.use(express.json()); //middleware to convert JSON to JS object

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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    const count = await User.countDocuments({});
    console.log(count);
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user", async (req, res) => {
  const id = req.body.id;

  try {
    const result = await User.findById(id);
    if (result == null) {
      res.status(404).send("User not found");
    } else res.send(result);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// app.get("/byemail", async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     const result = await User.findOne({ email: userEmail });

//     if (result == null) {
//       res.status(404).send("user not found");
//     }
//     else
//     {
//         res.send(result);
//     }

//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/byemail",async (req,res) => {
//     const up = req.body;

//     try {
//         const result = await User.findOneAndUpdate({email : req.body.email},up);
//         // console.log(result);
//         if(result == null)
//         {
//             res.status(404).send("User not found");
//         }
//         else res.send("User updated");
//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }

// })

app.delete("/user", async (req, res) => {
  const id = req.body.id;

  try {
    const result = await User.findByIdAndDelete(id);
    if (result == null) {
      res.status(404).send("user not found");
    } else res.send("deleted the user");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const up = req.body;

  const cannotUpdate = ["email"];

  try {
    //check if user is updateing fields that are not allowed to update
    Object.keys(up).forEach((key) => {
      if (cannotUpdate.includes(key)) throw new Error("Cant update " + key);
    });

    //tags should not be more than 3
    if (up.tags && up.tags.length > 3) {
      throw new Error("Too many tags");
    }

    //bio validation
    if (up.bio && up.bio.length > 100) {
      throw new Error("Bio is too long. Keep it short ..!");
    }

    const result = await User.findByIdAndUpdate(id, up, {
      runValidators: true,
    });
    // console.log(result);
    if (result == null) {
      res.status(404).send("User not found");
    } else res.send("User updated");
  } catch (error) {
    res.status(400).send("Something went wrong " + error);
  }
});

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
