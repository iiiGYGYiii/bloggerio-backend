const User = require("../models/user");

const addBlogId = async (userId, blogId)=>{
  const userBlogs = await User.findById(userId);
  const blogs = userBlogs.blogs.concat(blogId);
  await User.findOneAndUpdate({_id:userId}, {blogs: blogs});
};

module.exports = {
  addBlogId
};
