const mongoose = require("mongoose")

const employeSchema = new mongoose.Schema({
    name : String,
    role : String,
    sub : String,
})

const Employe = mongoose.model("Employe",employeSchema);

module.exports = {Employe}