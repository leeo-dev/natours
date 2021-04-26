const fileSystem = require("fs");
const express = require("express");
const app = express();
app.use(express.json());

const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get("/api/v1/tours", (request, response)=>{
  response.status(200).json({status: 'success', result: tours.length , data: {tours}});
});

app.get("/api/v1/tours/:id", (request, response)=>{
  const id = +request.params.id;
  const tour = tours.find(element => element.id === id);

  if(!tour){
    return response.status(404).json({status: 'fail', message: "Invalid id"});
  }else{
  response.status(200).json({status: 'success', result: 1, data: {tour}});
  }
});

app.post("/api/v1/tours", (request, response)=>{
  const id = tours.length;
  const newTour = Object.assign({id}, request.body);
  tours.push(newTour);
  fileSystem.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
  response.status(201);
  response.json({status: "success", data: newTour});
  })
});

app.patch("/api/v1/tours/:id", (request, response)=>{
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

});

app.delete("/api/v1/tours/:id", (request, response)=>{
  const id = +request.params.id;
  if(id > tours.length){
    response.status(404).json({status: "failed", message: "Id not found!"});
  }else{
    response.status(204).json({status: "success", data: null});
  }
});

const port = 3000;
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
});

