const express = require("express");

const app = express();

app.get(/.*man$/, (req, res) => {
  //get the data from data base
  res.send("got the data of the users");
});

app.get("/user/:userid/:name", (req, res) => {
  console.log(req.params);
  res.send(req.params);
});

app.post(
  "/user",
  (req, res,next) => {
    //post data
    // res.send("data for user posted sucessfully");
    next();
  },
  [(req, res, next) => {
    console.log("post 2");
    next();
  },
  (req,res,next) => {
    console.log("post 3");
    next();
    res.send("done 3")
    
  }],
  (req,res,next) => {
    console.log("post 4");
    // res.send("done 4")
    // next();
  }
);

app.delete("/user", (req, res) => {
  //post data
  res.send("data for user deleted sucessfully");
});

app.put("/user", (req, res) => {
  res.send("data is updated by replacement");
});

app.listen(3000, () => {
  console.log("connection established");
});
