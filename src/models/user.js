const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, maxLength: 30, minLength: 2 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 20 },
    gender: {
      type: String,
      validate: (value) => {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("invalid gender");
        }
      },
    },
    age: { type: Number, min: 18 },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    tags: { type: Array },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
