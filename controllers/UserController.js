const User = require("./../models/userModels");
const catchAsync = require("../Utils/catchAsync");
const appError = require("../Utils/appError");

const filterObject = (bodyObject, ...allowedFields) =>{
  let newObject = {};
  Object.keys(bodyObject).forEach((element)=>{
    if(allowedFields.includes(element)){
      newObject[element] = bodyObject[element];
    }
  });
  return newObject;
}

exports.getAllUsers = catchAsync(async (request, response, next)=>{
  const users = await User.find(); 
    response.status(200).json({status: 'success', result: users.length , data: {users}});
    next();
});

exports.updateMe = catchAsync(async(request, response, next)=>{
  if(request.body.password || request.body.passwordConfirm ){
    return next(new appError("This route is not for password updates. Please use /updateMyPassword", 400));
  } 
  const filteredBody = filterObject(request.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(request.user.id, filteredBody, {new: true, runValidators: true});
  response.status(200).json({status: 'success', data: {user: updatedUser}});
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