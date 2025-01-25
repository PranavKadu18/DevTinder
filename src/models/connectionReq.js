const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },

    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
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

//adding compound index
connectionSchema.index({fromUserId : 1,toUserId : 1,status : 1});

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