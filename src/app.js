const express = require("express");
const {connect} = require("./Config/connect")
const {User} = require("./models/user")

const app = express();

app.use(express.json()); //middleware to convert JSON to JS object

app.post("/signup",async (req,res) => {
    //we need to create the instance of model to add the data to db
    const user = new User(req.body);

    try {
        await user.save();
        res.send("data saved sucessfully to the db");
    } catch (error) {
        res.status(400).send("Error occured while sign up")
    }
})


//first we should connect to db and then listen to any request

connect()
.then(()=>{
    //connect
    console.log("Database connected to the server");
    //then listen
    app.listen(3000, () => {
        console.log("Server is listning to port 3000");
     });
})
.catch((err) => {
    console.log("Cannot connect to database");
})



