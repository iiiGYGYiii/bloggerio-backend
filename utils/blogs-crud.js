const Blog = require("../models/blog.js");
const Comment = require("../models/comment");
const CRUD = require("./crud-methods");

const read = async (filter={}) =>{
  const result = await Blog
    .find(filter)
    .populate("comments", {content: true})
    .populate("user", {username: true, name: true});
  return result;
};

const addCommentToBlog = async (blogId, commentId)=>{
  const blog = await Blog.findById(blogId);
  const comments = blog.comments.concat(commentId);
  await Blog.findByIdAndUpdate(blogId, {comments});
};

const createComment = async (blogId, comment) => {
  const data = await CRUD.createDoc(comment, Comment);
  await addCommentToBlog(blogId, data._id);
  return data;
};

module.exports = {
  read,
  createComment
};
