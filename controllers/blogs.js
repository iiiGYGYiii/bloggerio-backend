const blogRouter = require("express").Router();
const CRUD = require("../utils/crud-methods");
const blogCRUD = require("../utils/blogs-crud");
const userCRUD = require("../utils/userCRUD");
const Blog = require("../models/blog");

blogRouter.route("/")
  .get(async (req,res)=>{
    const data = await blogCRUD.read({});
    res.json(data);
  })
  .post(async (req,res)=>{
    if (!req.user){
      return res.status(401).json({error: "must be logged to create blog"}).end();
    }
    const newBlog = {
      ...req.body,
      user: req.user.id
    };
    const data = await CRUD.createDoc(newBlog, Blog);
    userCRUD.addBlogId(req.user.id, data._id);
    typeof data === "number"?
      res.status(data).end():
      data.error?
        res.status(400).json(data).end():
        res.json(data);
  });

blogRouter.route("/:id")
  .get(async (req,res) => {
    const data = await blogCRUD.read({_id: req.params.id});
    if (data.length){
      res.json(data);
      return;
    }
    res.status(404).end();
  })
  .delete(async(req,res)=>{
    await CRUD.deleteElement(req.params.id, Blog, req.user);
    res.status(204).end();
  })
  .put(async(req,res)=>{
    const response = await CRUD.updateDoc(req.params.id,req.body, Blog, req.user);
    typeof response === "number"?
      res.status(response).end():
      response.error?
        res.status(400).json(response).end():
        res.json(response);
  })
  .patch(async(req,res)=>{
    const data = await blogCRUD.read({_id: req.params.id});
    const updateItem = {
      ...data,
      ...req.body
    };  
    const response = await CRUD.updateDoc(req.params.id,updateItem, Blog, req.user);
    typeof response === "number"?
      res.status(response).end():
      response.error?
        res.status(400).json(response).end():
        res.json(response);
  });

blogRouter.route("/:id/comment")
  .post(async(req, res)=>{
    if (!req.user){
      return res.status(401).json({error: "must be logged to comment"}).end();
    }
    
    const blog = await Blog.findById(req.params.id);
    if (!blog){
      res.status(404).end();
      return;
    }
      
    const newComment = {
      ...req.body,
      blog: req.params.id
    };
    const data = await blogCRUD.createComment(req.params.id, newComment);
    typeof data === "number"?
      res.status(data).end():
      data.error?
        res.status(400).json(data).end():
        res.json(data);
  });


module.exports = blogRouter;
