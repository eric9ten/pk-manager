const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
