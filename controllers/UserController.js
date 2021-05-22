const User = require("./../models/userModels");
const catchAsync = require("../Utils/catchAsync");

exports.getAllUsers = catchAsync(async (request, response, next)=>{
  const users = await User.find(); 
    response.status(200).json({status: 'success', result: users.length , data: {users}});
    next();
});

exports.createUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

exports.getSingleUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

exports.updateUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

exports.deleteUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 