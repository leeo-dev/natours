const express = require("express");
const morgan = require("morgan");
const appError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const toursRouter = require("./routes/toursRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();
if(process.env.NODE_ENV === 'development'){
app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((request, response, next)=>{
  request.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", toursRouter);  
app.use("/api/v1/users", usersRouter);  

app.all('*', (request, response, next)=>{
  // response.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${request.originalUrl} on this server!`
  // });

  next(new appError(`Can't find ${request.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
