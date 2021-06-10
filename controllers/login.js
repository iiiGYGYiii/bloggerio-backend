const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.route("/")
  .post(async(req,res)=>{
    const user = await User.findOne({username: req.body.username});
    const {password, username} = req.body;
    
    const passwordCorrect = user === null?
      false:
      await bcrypt.compare(password, user.passwordHash);         

    if (!(user && passwordCorrect)){
      return res.status(401).json({
        error: "invalid username or password"
      });
    }

    const userForToken= {
      username,
      id: user._id
    };

    const token = jwt.sign(userForToken,
      process.env.SECRET,
      {
        expiresIn: 60*60
      });

    res.status(200).json({
      token,
      id: user._id,
      username: user.username,
      name:user.name
    });

  // eslint-disable-next-line indent
});

module.exports = loginRouter;
