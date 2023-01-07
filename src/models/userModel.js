const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
  },

  email: {
    type: String,
    required: [true, "Email id is a mandatory field"],
    unique: true,
    trim:true
  },

  password: {
    type: String,
    required: [true, "Password length should be atleast 8 characters"],
    minlength: 8,
  },
},
{timestamps:true, versionKey:false}
);

module.exports = mongoose.model("User", userSchema);
