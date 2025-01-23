const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    status : {
        type : String,
        required : true,
        enum : {
            values : ["Accepted","Rejected","Intrested","Ignored"],   //leftswipe -> ignored && rightswipe -> intrested
            message : `{VALUES} is not a valid field`
        }
    }
},{timestamps : true})

//this is pre middleware that runs before 'save'
connectionSchema.pre('save',function (next) {
    //this here reffers to the thing that is going to be saved or the current request
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cant send connection request to ourself");
    }
    next();
})


const ConnectionRequest = mongoose.model("ConnectionRequest",connectionSchema);

module.exports = {ConnectionRequest};