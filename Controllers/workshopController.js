const Workshop = require('../Models/workshopModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getAllWorkshops = factory.getAll(Workshop);
exports.getWorkshop = factory.getOne(Workshop);
exports.createWorkshop = factory.createOne(Workshop);
exports.updateWorkshop = factory.updateOne(Workshop);
exports.deleteWorkshop = factory.deleteOne(Workshop);