const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  username:{
    type: String,
    validate:{
      validator: v => !/\W/gm.test(v),
      message: props=> `${props.value} cannot contain special characters.`
    },
    minLength: 3,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    default: []
  }]
}).plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model("User", userSchema);
