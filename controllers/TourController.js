const fileSystem = require("fs");
const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.allTours = (request, response)=>{
  console.log(request.requestTime);
  response.status(200).json({status: 'success', requestAt: request.requestTime, result: tours.length , data: {tours}});
};

exports.singleTour = (request, response)=>{
  const id = +request.params.id;
  const tour = tours.find(element => element.id === id);
  if(!tour){
    return response.status(404).json({status: 'fail', message: "Invalid id"});
  }else{
  response.status(200).json({status: 'success', result: 1, data: {tour}});
  }
};

exports.createTour = (request, response)=>{
  const id = tours.length;
  const newTour = Object.assign({id}, request.body);
  tours.push(newTour);
  fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
  response.status(201);
  response.json({status: "success", data: newTour});
  })
};

exports.updateTour = (request, response)=>{
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

exports.deleteTour = (request, response)=>{
  const id = +request.params.id;
  if(id > tours.length){
    response.status(404).json({status: "failed", message: "Id not found!"});
  }else{
    response.status(204).json({status: "success", data: null});
  }
};