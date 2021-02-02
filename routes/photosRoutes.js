const express = require('express');

const controller = require('../controllers/photosController');

const router = express.Router();

router.post('/list', controller.getPhotosList);

router.route('/').put(controller.uploadPhotos, controller.savePhotosDetails).delete(controller.deletePhotos);

router.route('/:album/:name').get(controller.getPhoto).delete(controller.deletePhoto);

module.exports = router;