const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const catchAsync = require("../Utils/catchAsync");
const appError = require("./../Utils/appError");

exports.signup = catchAsync(async(request, response, next)=>{
  const {name, email, password, passwordConfirm} = request.body
  const newUser = await User.create({name, email, password, passwordConfirm});
  const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
  response.status(201).json({status: 'success', token, data: {user: newUser}});
  next();
});

exports.login = (request, response, next) =>{
  const {email, password} = request.body;
  if(!email || !password){
    return next(new appError('Please provide E-mail and Password!', 400));
  }

  const user = User.findOne({email});
  next();
}