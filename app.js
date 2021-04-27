const express = require("express");
const morgan = require("morgan");
const toursRouter = require("./routes/toursRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use((request, response, next)=>{
  request.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", toursRouter);  
app.use("/api/v1/users", usersRouter);  

const port = 3000;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
});
