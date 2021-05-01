const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true}) 
  .then((connect)=>{
    console.log("DB connections succesful");
});

const app = require("./app");
const port = process.env.PORT || 3030;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
}); 