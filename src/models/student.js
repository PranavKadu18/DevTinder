const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    name:String,
    rollno:Number,
    class:String,
    cgpa:Number
})

const Student = mongoose.model("Student",studentSchema);

module.exports = {Student}