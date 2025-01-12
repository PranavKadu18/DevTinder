const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { 
        type: String, 
        required: true, 
        maxLength: 30, 
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
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    profilePhoto: {
        type : String,
        default : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
