const Blog = require("../models/blog.js");

/**
 * Store a given data to the DB. If item exists, return an error.
 * When data is invalid by its content, will return 400.
 |* @param {JSON} data Data to store on the DB.
 * @returns A promise. If succeed, the data stored, else an status code.
 */
const createDoc = async (data, Model) =>{
  try {
    const docToSave = new Model(data);
    return await docToSave.save();
  } catch (e) {
    return e.name === "ValidationError"? {error: e.message}: 400;
  }
};

/**
 * Search on DB given a query. Retrieves all if filter is not given.
 * @param {JSON} filter Query filter to search on DB, if not given returns all data.
 * @returns A promise of found data
 */
const find = async (filter={}, Model, Populates, SetPopulates) =>{
  const result = await Model.find(filter).populate(Populates, SetPopulates);
  return result;
};

/**
 * Find data in DB by given ID.
 * @param {String} id ID to find in the DB.
 * @returns A promise. If succeed, found data, else, undefined.
 */
const findById = async (id, Model) =>{
  try {
    const result = await Model.findById(id);
    return result;
  } catch (e) {
    return undefined;
  }
};

/**
 * Update item on DB depending on its size.
 * @param {String} id ID of item to be updated.
 * @param {JSON} data Data to be updated.
 * @param {Number} size Quantity of elements to be updated.
 * @returns A promise, if succeed, updated data; else, status code.
*/
const updateDoc = async(id, data, Model, User) =>{
  const blog = await findById(id, Model);
  if (!blog){
    return 404;
  }
  if (blog._id.toString()===User.id){
    return 401;
  }
  const newDoc = {...blog._doc, ...data};
  try {
    await Model.validate(newDoc);
    await Model.updateOne({_id: id}, newDoc);
    return await findById(id, Model);
  } catch (e) {
    return e.name === "ValidationError"? {error: e.message}: 400;
  }  
};

const updateLikes = async(id) =>{
  const blog = await findById(id);
  if(!blog){
    return 404;
  }
  try {
    await Blog.updateOne({_id: id}, {...blog, likes: blog.likes+1});
    return await findById(id);
  } catch (e) {
    return e.name === "ValidationError"? {error: e.message}:400;
  }
};

/**
 * Delete an item on DB given an ID.
 * @param {String} id ID of item to be deleted
 * @returns Promise. Undefined.
 */
const deleteElement = async (id, Model, User) =>{
  if(!User){
    return;
  }
  const data = await Model.findById(id);
  if (data.user.toString() !== User.id){
    return;
  }
  try {
    await Model.findByIdAndDelete(id);
    return;
  } catch (e) {
    return; 
  }
};

module.exports = {
  createDoc,
  find,
  findById,
  updateDoc,
  updateLikes,
  deleteElement
};