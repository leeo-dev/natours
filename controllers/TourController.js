
const Tour = require(`${__dirname}/../models/tourModel`);
// const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (request, response, next)=>{
  // const tour = request.body;
  // for(const property in tour){
  //   if(tour[property] == ""){
  //     return response.status(400).json({status: "fail", message: "faltando informações"})
  //   }
  // }
  
  next();
}

exports.allTours = async (request, response)=>{
  const tours = await Tour.find();
  try{
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

exports.createTour = (request, response)=>{
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