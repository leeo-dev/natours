const appError = require("./../Utils/appError");

const handleCastErrorDB = err =>{
  const message = `Invalid ${err.path} is ${err.value}`;
  return new appError(message, 400);
}

const handleDuplicateFieldsDB = (err)=>{
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value ${value}. Please use another value`;
  return new appError(message, 400);
}

const sendErrorForDev = (err, response)=>{
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sendErrorProd = (err, response)=>{
  // Operations, trusted error: send message to the client
  if(err.isOperational){
    response.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
  // Programming or other unknown error: don't leak error details
  }else{
    //01 log error 
    console.error('ERROR: ', err);
    //02 Send generic message
    response.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
}

module.exports = (err, request, response, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development'){
    sendErrorForDev(err, response);
  }else if(process.env.NODE_ENV === 'production'){
    let error = {...err};
    if(error.name === 'CastError') error = handleCastErrorDB(error)
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, response);
  }
  
}