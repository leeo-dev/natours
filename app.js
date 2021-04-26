const express = require("express");
const routes = require("./routes");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use((request, response, next)=>{
  request.requestTime = new Date().toISOString();
  next();
});
app.use(routes);  

const port = 3000;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
});

