const express = require("express");
const { connect } = require("./Config/connect");
const { User } = require("./models/user");

const app = express();

app.use(express.json()); //middleware to convert JSON to JS object

app.post("/signup", async (req, res) => {
  //we need to create the instance of model to add the data to db
  const user = new User(req.body);

  try {
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

app.get("/user",async (req,res) => {
    const id = req.body.id;

    try {
        const result = await User.findById(id);
        if(result == null)
        {
            res.status(404).send("User not found");
        } 
        else res.send(result);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

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

app.delete("/user",async (req,res) => {
    const id = req.body.id

    try {
        const result = await User.findByIdAndDelete(id)
        if(result == null)
        {
            res.status(404).send("user not found")
        }
        else res.send("deleted the user");
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user",async (req,res) => {
    const id = req.body.id;
    const up = req.body;

    try {
        const result = await User.findByIdAndUpdate(id,up);
        // console.log(result);
        if(result == null)
        {
            res.status(404).send("User not found");
        }
        else res.send("User updated");
    } catch (error) {
        res.status(400).send("Something went wrong");
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
