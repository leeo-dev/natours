const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const app = require("./app");

//Mongoose Configurations
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true}) 
  .then((connect)=>{
    console.log("DB connections successful");
});


//App configurations
const port = process.env.PORT || 3030;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
}); 