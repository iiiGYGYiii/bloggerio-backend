const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const CRUD = require("../utils/crud-methods");

userRouter.route("/")
  .get(async(req,res)=>{
    const users = await User.find({}).populate("blogs");
    res.json(users);
  })
  .post(async(req,res)=>{
    if (req.body?.password.length <=3){
      return res.status(400).json({error: "Minimum length for password is 4 characters"}).end();
    }
    const passwordHash = await bcrypt.hash(req.body?.password, 10);
    const user = {
      username: req.body?.username,
      name: req.body?.name,
      passwordHash
    };
    const data = await CRUD.createDoc(user, User);
    typeof data === "number"?
      res.status(data).end():
      data.error?
        res.status(400).json(data).end():
        res.json(data);
  });

userRouter.route("/:id")
  .get(async(req,res)=>{
    const user = await User.find({_id:req.params.id}).populate("blogs");
    if (user.length){
      res.json(user[0]);
      return;
    }
    res.status(404).end();
  }).patch(async(req,res)=>{
    if (req.body.password || req.body.passwordHash){
      res.status(403).json({
        error: "cannot modify password"
      }).end();
      return;
    }
    const data = await User.find({_id: req.params.id});
    if (!data.length){
      res.status(404).end();
      return;
    }
    const updateItem = {
      ...data[0]._doc,
      ...req.body
    };
    let response;
    try {
      const resRes = await User.findByIdAndUpdate(req.params.id, updateItem,{
        new: true,
        runValidators: true,
        context: "query"
      });
      console.log(resRes);
      response = await User.findById(req.params.id);
    } catch (e) {
      response = e.name === "ValidationError"? {error: e.message}: 400;
    }
    typeof response === "number"?
      res.status(response).end():
      response.error?
        res.status(400).json(response).end():
        res.json(response);
  });

module.exports = userRouter;
