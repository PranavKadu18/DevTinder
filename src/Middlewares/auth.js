const adminAuth = (req,res,next) => {
    key = "xyz";
    if(key === "xyz")
    {
        next();
    }
    else{
        res.sendStatus(401).send("acess denied");
    }
}

const userAuth = (req,res,next) => {
    key = "xyz";
    if(key === "xyhjz")
    {
        next();
    }
    else{
        res.sendStatus(401).send("acess denied");
    }
}

console.log("are woh are woh !");


module.exports = {
    adminAuth,
    userAuth
}