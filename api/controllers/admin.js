const { validationResult } = require('express-validator');

const { HttpError } = require('../models/http-error');

const Tour = require('../models/tour');

exports.getTours = async (req, res, next) => {
  let tours;
  try {
    tours = await Tour.find({});
  } catch (err) {
    const error = new HttpError(
      'Fetching tours failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!tours || tours.length === 0) {
    return next(new HttpError('Could not find tours.', 404));
  }

  res.json({
    tours: tours.map((tour) => tour.toObject({ getters: true })),
  });
};

exports.getTour = async (req, res, next) => {
  const { tourId } = req.params;

  let tour;
  try {
    tour = await Tour.findById(tourId);
    res.json({ tour: tour.toObject({ getters: true }) });
  } catch (err) {
    console.log(err);
  }
};

exports.addTour = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description, location, duration, price, date } = req.body;

  console.log(req.file)

  const newTour = new Tour({
    title,
    description,
    duration,
    price,
    location,
    date,
    image: req.file.path,
  });

  try {
    await newTour.save();
  } catch (err) {
    const error = new HttpError('Creating tour failed, please try again.', 500);
    return next(error);
  }
  res.status(201).json({ message: 'Tour created!', tourId: newTour._id });
};

exports.updateTour = async (req, res, next) => {
  const { title, description, duration, location, price, date } = req.body;
  const { tourId } = req.params;

  let tour;
  try {
    tour = await Tour.findById(tourId);
  } catch (err) {
    console.log(err);
  }

  tour.title = title;
  tour.description = description;
  tour.location = location;
  tour.duration = duration;
  tour.price = price;
  tour.date = date;

  try {
    await tour.save();
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ tour: tour.toObject({ getters: true }) });
};

exports.deleteTour = async (req, res, next) => {
  const { tourId } = req.params;

  let tour;
  try {
    tour = await Tour.findByIdAndDelete({ _id: tourId });
    res.status(200).json({ message: 'Deleted a tour.' });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete the tour.',
      500
    );
    return next(error);
  }
};
