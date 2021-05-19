const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require("../Utils/APIFeatures");
const catchAsync = require("../Utils/catchAsync");
const appError = require("../Utils/appError");
exports.aliasTopTours = (request, response, next)=>{
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price, ratingsAverage,summary,difficulty';
  next();
}

exports.allTours = catchAsync(async (request, response, next)=>{
    const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query; 
    response.status(200).json({status: 'success', result: tours.length , data: {tours}});
});

exports.singleTour = catchAsync(async (request, response, next)=>{
    const id = request.params.id;
    const tour = await Tour.findById(id);
    if(!tour){
      return next(new appError('No tour found with that ID', 404));
    }
    response.status(200).json({status: 'success', result: 1, data: {tour}});
});

exports.createTour = catchAsync(async (request, response, next)=>{
    const tourBody = request.body;
    const newTour = await Tour.create(tourBody);
    response.status(200).json({status: 'success', data: {newTour}});
});

exports.updateTour = catchAsync(async (request, response, next)=>{
    const tourBody = request.body;
    const id = request.params.id;
    const tour = await Tour.findByIdAndUpdate(id, tourBody, {new: true, runValidators: false});
    if(!tour){
      return next(new appError('No tour found with that ID', 404));
    }
    response.status(200).json({status: 'success', result: 1, data: {tour}});
});

exports.deleteTour = catchAsync(async (request, response, next)=>{
  const id = request.params.id;
  const tour = await Tour.findByIdAndDelete({_id: id});

  if(!tour){
      return next(new appError('No tour found with that ID', 404));
    }
  response.status(204).json({status: 'success', data: null});
});


exports.getTourStats = catchAsync(async (request, response, next) =>{
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
});

exports.getMonthlyPlan = catchAsync(async (request, response, next)=>{
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
});