const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const catchAsync = require("../Utils/catchAsync");
const appError = require("./../Utils/appError");
const sendEmail = require("./../Utils/email");


const signToken = (idUser) =>{
  return jwt.sign(
    {id: idUser},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN}
    )
}

const createSendToken = (user, statusCode, response) =>{
  const token = signToken(user._id);
  response.status(statusCode).json({status: 'success', token, data: {user}})
}

exports.signup = catchAsync(async(request, response, next)=>{
  const {name, email, password, passwordConfirm, role} = request.body
  const newUser = await User.create({name, email, password, passwordConfirm, role});
  createSendToken(newUser, 201, response);
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
  createSendToken(user, 200, response);
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
  const resetURL = `${request.protocol}://${request.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to: ${resetURL}.\n If you didn't forget your password, please ignore this E-mail`;

  try {
  await sendEmail({email: user.email, subject: 'Your password reset token (valid only for 10 minutes)', message});
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});

    return next(new appError('There was an error sending the email. Try again later', 500));
  }

  response.status(200).json({status: 'success', message: 'Token send to e-mail'});
});

exports.resetPassword = catchAsync( async (request, response, next) => {
  // 1) get user based on the token
  const hashedToken = crypto.createHash('sha256').update(request.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
  console.log(user);
  if(!user){
    return next(new appError('Token is invalid or has expired', 400));
  }
  // 2) Set the new password if only the token has not expired, and there is user
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // 3) Update changedPassword property for the current user
  await user.save();
  // 4) Log the user in, send JWT
  createSendToken(user, 200, response);

});

exports.updatePassword = catchAsync( async (request, response, next)=>{
  // 1) Get user from collection
  const user = await User.findById(request.user.id).select('+password');
  // 2) Check if POSTed password is correct
  if(!(await user.correctPassword(request.body.passwordCurrent, user.password))){
    return next(new appError('Your current password is wrong!', 401));
  }
  // 3) If the password is correct then update the password
  user.password = request.body.password;
  user.passwordConfirm = request.body.password;
  await user.save();
  // 4) Log user in, send JWT
  createSendToken(user, 200, response);
});