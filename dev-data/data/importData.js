const fileSystem = require('fs');
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const Tour = require('./../../models/tourModel');

//Mongoose Configurations
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true}) 
  .then((connect)=>{
    console.log("DB connections successful");
});

const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/../data/tours-simple.json`, 'utf-8'));
const  importData = async ()=>{
  try{
    await Tour.create(tours);
    console.log("Data successfully loaded");
  }catch(err){
    console.log(err);
  }
    process.exit();
}

const deleteData = async ()=>{
  try{
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  }catch(err){
    console.log(err);
  }
    process.exit();
}

if(process.argv[2] === '--import'){
  importData();
}

if(process.argv[2] === '--delete'){
  deleteData();
}

console.log(process.argv);