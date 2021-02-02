const express = require('express');

const controller = require('../controllers/photosController');

const router = express.Router();

router.post('/list', controller.getPhotosList);

router.put('/', controller.uploadPhotos, controller.savePhotosDetails);

router.route('/:album/:name').get(controller.getPhoto).delete(controller.deletePhoto);

module.exports = router;