const express = require("express");
const {adminAuth,userAuth} = require("./Middlewares/auth");
const {connect} = require("./Config/connect")
const {User} = require("./models/user")
const {Employe} = require("./models/employe");
const { Student } = require("./models/student");

const app = express();

app.post("/signup",async (req,res) => {
    const data = {
        firstName : "Donald",
        lastName : "Trump",
        email : "donald@gmail.com",
        password : "donald@123"
    }

    //we need to create the instance of model to add the data to db
    const user = new User(data);

    try {
        await user.save();
        res.send("data saved sucessfully to the db");
    } catch (error) {
        res.status(400).send("Error occured while sign up")
    }
})

app.post("/employe", async (req,res) => {
    const data = {
        name : "ravi",
        role : "dba",
        subject : "dbms"
    }

    const emp = new Employe(data);

    try {
        await emp.save();
        res.send("Data saved (employe)")
    } catch (error) {
        res.status(400).send("failed");
    }

})

app.post("/student",async (req,res) => {
    const data = {
        name : "Pranav",
        rollno: 54,
        class : "div1",
        cgpa : 9.25
    }

    const stud = new Student(data);

    try {
        await stud.save();
        res.send("data saved (student)");
    } catch (error) {
        res.status(400).send("error occured");
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



