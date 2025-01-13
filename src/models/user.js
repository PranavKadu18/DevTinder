const mongoose = require("mongoose");
const validator = require("validator");

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
      validate: (value) => {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
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
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
