const mongoose = require("mongoose");

const connect = async () => {
    await mongoose.connect("mongodb+srv://pranav1812:pranav2003@cluster0.nzart.mongodb.net/DevTinder");
}




module.exports = {connect}