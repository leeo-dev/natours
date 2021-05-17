const Tour = require(`${__dirname}/../models/tourModel`);
// const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const APIFeatures = require("../Utils/APIFeatures");

exports.aliasTopTours = (request, response, next)=>{
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price, ratingsAverage,summary,difficulty';
  next();
}

exports.allTours = async (request, response)=>{
  try{
    //Execute Query
    const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query; 
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


exports.getTourStats = async (request, response) =>{
  try {

    const stats = await Tour.aggregate([
      {$match: {ratingsAverage: {$gte: 4.5}}},
      {$group: {
        _id: {$toUpper: '$difficulty'},
        numTours: {$sum: 1},
        numRatings: {$sum: '$ratingsQuantity'},
        avgRating: {$avg: '$ratingsAverage'}, 
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
        }
      },
      {$sort: {avgPrice: 1}},
      //{$match: {_id: {$ne: 'EASY'}}}
    ]);

    response.status(200).json({status: 'success', data: {stats}});
    
  } catch (err) {
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }
}

exports.getMonthlyPlan = async (request, response)=>{
  try {
    const year = request.params.year * 1;
    const plan = await Tour.aggregate([
      {$unwind: '$startDates'},
      {
        $match: {startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }}
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numTourStart: {$sum: 1},
          tours: {$push: '$name'}
          },
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {_id: 0}
      },
      {
        $sort: { numTourStart: -1 }
      },
      {
        $limit: 12
      }
    ]);
    response.status(200).json({status: 'success', data: {plan}});
  } catch (err) {
    console.log(err);
    response.status(404).json({
      status: "fail",
      message: err
    });
  }
}