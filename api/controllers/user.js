const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const dayjs = require('dayjs');

const { HttpError } = require('../models/http-error');

const Doctor = require('../models/tour');
const Appointment = require('../models/appointment');
const User = require('../models/user');

exports.getDoctors = async (req, res, next) => {
  let doctors;
  try {
    doctors = await Doctor.find({});
    // console.log(doctors);
  } catch (err) {
    const error = new HttpError(
      'Fetching doctors failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!doctors || doctors.length === 0) {
    return next(new HttpError('Could not find doctors.', 404));
  }

  res.json({
    doctors: doctors.map(doctor => doctor.toObject({ getters: true })),
  });
};

exports.addAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(HttpError);
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { time, userId, doctorId } = req.body;

  const newAppointment = new Appointment({
    time,
    userId,
    doctorId,
  });

  // console.log(req.userData);
  // console.log(userId);

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Creating appointment failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newAppointment.save({ session: sess });
    user.appointments.push(newAppointment);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating appointment failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({
    message: 'Appointment created!',
    appointmentId: newAppointment._id,
  });
};

exports.getUserAppointments = async (req, res, next) => {
  const { userId } = req.userData;

  let appointments;
  try {
    appointments = await Appointment.find({ userId: userId }).populate(
      'doctorId'
    );
  } catch (err) {
    const error = new HttpError(
      'Fetching appointments failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!appointments || appointments.length === 0) {
  //   return next(new HttpError('Could not find appointments.', 404));
  // }

  res.json({
    appointments: appointments.map(appointment => {
      const appointmentSeralized = appointment.toObject({ getters: true });
      const appointmentDateTime = dayjs(appointmentSeralized.time);

      return {
        ...appointmentSeralized,
        date: appointmentDateTime.format('DD/MM/YYYY'),
        time: appointmentDateTime.format('h:mm A'),
      };
    }),
  });
};
