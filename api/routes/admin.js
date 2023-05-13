const express = require('express');

const adminController = require('../controllers/admin');

const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/tours', adminController.getTours);

router.get('/tours/:tourId', adminController.getTour);

router.post('/add-tour', fileUpload.single('image'), adminController.addTour);

router.patch('/tours/:tourId', adminController.updateTour);

router.delete('/tours/:tourId', adminController.deleteTour);

module.exports = router;
