module.exports = (err, request, response, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  response.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
}