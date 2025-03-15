require('dotenv').config();

const express = require("express");
const { connect } = require("./Config/connect");
const cookieParser = require("cookie-parser")
const { authRouter } = require("./Router/authRouter");
const { profileRouter } = require("./Router/profileRouter");
const {connectionRouter} = require("./Router/connectionRouter")
const {userRouter} = require("./Router/userRouter");
const cors = require('cors');
require("./utils/cronjob");

const app = express();


app.use(cors({
  origin:"http://localhost:5174",
  credentials:true,
}));

app.use(express.json()); //middleware to convert JSON to JS object

app.use(cookieParser()); //middleware to make cookie readable



app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",userRouter);





//first we should connect to db and then listen to any request
connect()
  .then(() => {
    //connect
    console.log("Database connected to the server");
    //then listen
    app.listen(process.env.PORT, () => {
      console.log("Server is listning to port 3000");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to database");
  });
