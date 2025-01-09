const express = require("express");
const {adminAuth,userAuth} = require("./Middlewares/auth");
const {connect} = require("./Config/connect")

const app = express();


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



