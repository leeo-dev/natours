const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const catchAsync = require("../Utils/catchAsync");
const appError = require("./../Utils/appError");


const signToken = (idUser) =>{
  return jwt.sign(
    {id: idUser},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN}
    )
}

exports.signup = catchAsync(async(request, response, next)=>{
  const {name, email, password, passwordConfirm, role} = request.body
  const newUser = await User.create({name, email, password, passwordConfirm, role});
  const token = signToken(newUser._id);
  response.status(201).json({status: 'success', token, data: {user: newUser}});
  next();
});

exports.login = catchAsync( async (request, response, next) =>{
  const {email, password} = request.body;
  if(!email || !password){
    return next(new appError('Please provide E-mail and Password!', 400));
  }

  const user = await User.findOne({email}).select('+password');
  const isCorrectPassword = await user.correctPassword(password, user.password);
  if(!user || !isCorrectPassword){
    return next(new appError('Incorrect e-mail or password', 401));
  }
  const token = signToken(user._id);
  response.status(200).json({status: 'success', token});
  next();
});

exports.protect = catchAsync(async (request, response, next)=>{
  // 1) Getting token and check if it's there
  let token;
  if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
    token = request.headers.authorization.split(" ")[1];
  }

  if(!token){
    return next(new appError("You are not logged in! Please login to get access.", 401));
  }
  // 2) Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  
  // 3) Check if user still exits
  const freshUser = await User.findById(decode.id);
  if(!freshUser){
    return next(new appError('The user belonging to this token does longer exists.', 401));
  }
  // 4) Check if user changed password after the token was issued
  if(freshUser.changedPasswordAfter(decode.iat)){
    return next(new appError('User recently changed password! Please log in again.',401));
  }
  request.user = freshUser;
  next();
});

exports.restrictTo = (...roles) =>{
  return (request, response, next)=>{
    if(!roles.includes(request.user.role)){
      return next(new appError('You do not have permission to perform this action', 403));
    }
  next(); 
  }
}

exports.forgotPassword = catchAsync(async (request, response, next) => {
  //Get user based on E-mail
  const email = request.body.email
  const user = await User.findOne({email});
  if(!user){
    next(new appError('There is no user with email address.',404))
  }
  //Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  //Send it to user's e-mail
});

exports.resetPassword = (request, response, next) => {
  
}