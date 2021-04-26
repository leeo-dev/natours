const express = require("express");
const route = express.Router();
const fileSystem = require("fs");
const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));



const allTours = (request, response)=>{
  console.log(request.requestTime);
  response.status(200).json({status: 'success', requestAt: request.requestTime, result: tours.length , data: {tours}});
};

const singleTour = (request, response)=>{
  const id = +request.params.id;
  const tour = tours.find(element => element.id === id);
  if(!tour){
    return response.status(404).json({status: 'fail', message: "Invalid id"});
  }else{
  response.status(200).json({status: 'success', result: 1, data: {tour}});
  }
};

const createTour = (request, response)=>{
  const id = tours.length;
  const newTour = Object.assign({id}, request.body);
  tours.push(newTour);
  fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
  response.status(201);
  response.json({status: "success", data: newTour});
  })
};

const updateTour = (request, response)=>{
  const id = +request.params.id;
  const update = request.body;
  const tour = tours.find(element => element.id === id);
  for(key in update){
    tour[key] = update[key];
  }
  fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) =>{
  response.status(201);
  response.json({status: "success", data: tour});
  })
};

const deleteTour = (request, response)=>{
  const id = +request.params.id;
  if(id > tours.length){
    response.status(404).json({status: "failed", message: "Id not found!"});
  }else{
    response.status(204).json({status: "success", data: null});
  }
};

const getAllUsers = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
}

const createUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

const getSingleUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

const updateUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

const deleteUser = (request, response)=>{
  response.status(500);
  response.json({status: "error", message: "This route is not yet implemented"});
} 

route.get("/api/v1/tours", allTours);
route.get("/api/v1/tours/:id", singleTour);
route.post("/api/v1/tours", createTour);
route.patch("/api/v1/tours/:id", updateTour);
route.delete("/api/v1/tours/:id", deleteTour);

route.get("/api/v1/users", getAllUsers);
route.post("/api/v1/users", createUser);
route.get("/api/v1/users/:id", getSingleUser);
route.patch("/api/v1/users/:id", updateUser);
route.delete("/api/v1/users/:id", deleteUser);


module.exports = route ; 