const { query } = require("express");

const Tour = require(`${__dirname}/../models/tourModel`);
// const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.allTours = async (request, response)=>{
  try{
    //Build Query
    // 01 - Filtering
    const queryObject = {...request.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((element)=> delete queryObject[element]);

    //Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const query = Tour.find(JSON.parse(queryString)); 
    
    //Execute Query
    const tours = await query; 
    response.status(200).json({status: 'success', result: tours.length , data: {tours}});
  }catch(err){
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.singleTour = async (request, response)=>{
  try{
    const id = request.params.id;
    const tour = await Tour.findById(id);
    response.status(200).json({status: 'success', result: 1, data: {tour}});
  }catch(err){
    response.status(404).json({status: "fail", message: err});
  }
};

exports.createTour = async (request, response)=>{
  try{
    const tourBody = request.body;
    const newTour = await Tour.create(tourBody);
    response.status(200).json({status: 'success', data: {newTour}});
  }catch(err){
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }

  // const id = tours.length;
  // const newTour = Object.assign({id}, request.body);
  // tours.push(newTour);
  // fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
  // response.status(201);
  // response.json({status: "success", data: newTour});
  // })
};

exports.updateTour = async (request, response)=>{
  try{
    const tourBody = request.body;
    const id = request.params.id;
    const tour = await Tour.findByIdAndUpdate(id, tourBody, {new: true, runValidators: false});
    response.status(200).json({status: 'success', result: 1, data: {tour}});

  }catch(err){
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }

  // const id = +request.params.id;
  // const update = request.body;
  // const tour = tours.find(element => element.id === id);
  // for(key in update){
  //   tour[key] = update[key];
  // }
  // fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) =>{
  // response.status(201);
  // response.json({status: "success", data: tour});
  // })
};

exports.deleteTour = async (request, response)=>{
  try{
  const id = request.params.id;
  await Tour.findByIdAndDelete({_id: id});
  response.status(204).json({status: 'success', data: null});
  }catch(err){
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }
    response.status(204).json({status: "success", data: null});
};