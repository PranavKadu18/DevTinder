const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: { 
        type: String, 
        required: true, 
        maxLength: 20, 
        minLength: 2 
    },
    lastName: { 
        type: String, 
        required: true, 
        minLength: 2, 
        maxLength: 20 
    },
    gender: {
      type: String,
      enum : {
        values : ["Male","Female","Others"],
        message : `{VALUE} is not a valid gender`
      }
      // validate: (value) => {
      //   if (!["Male", "Female", "Other"].includes(value)) {
      //     throw new Error("invalid gender");
      //   }
      //},
    },
    age: { 
        type: Number, 
        min: 18 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true ,
        validate : (value) => {
            if(!validator.isEmail(value))
            {
                throw new Error("Email is not valid");
            }
        }
    },
    password: { 
        type: String, 
        required: true,
        validate : (value) => {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Set a strong password");
            }
        }
    },
    profilePhoto: {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate : (value) => {
            if(!validator.isURL(value))
            {
                throw new Error("Enter valid URL");
            }
        }
    },
    tags: {
      type: [String],
      validate: (value) => {
        if (value.length > 3) {
          throw new Error("Too many tags");
        }
      },
    },
    bio: {
        type : String,
        default : "Hi There I am using DevTinder"
    },
    lastSeen : {
      type : String,
    }
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function(){
  const data = this;                           //this here reffers to the current user calling the functiom
  const token = await jwt.sign({_id : data._id},process.env.JWT_SECRET,{expiresIn : "7d"});
  return token;
}

userSchema.methods.checkPass = async function (passwordString){
  const data = this;
  const hash = data.password;
  const isPasswordValid = await bcrypt.compare(passwordString,hash);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
