const express = require('express');
const multer = require('multer');

const controller = require('../controllers/photosController');

const router = express.Router();

router.post('/list', controller.getPhotosList);

router.put('/', controller.uploadPhotos, controller.savePhotosDetails);

router.route('/:album/:name').get(controller.getPhoto).delete(controller.deletePhoto);

/* 
router.route('/top-5-cheap').get(controller.aliasTopTours, controller.getAllTours);

router.route('/stats').get(controller.getTourStats);

router.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

router.route('/').get(controller.getAllTours).post(controller.createTour);
router.route('/:id').get(controller.getTour).patch(controller.updateTour).delete(controller.deleteTour);
 */
module.exports = router;