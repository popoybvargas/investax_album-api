const fs = require('fs');

const { AppError, asyncCatch } = require('zv-express-error-handler');
const multer = require('multer');

const Photo = require('../models/photoModel');

let fileNames = [];

const setFilename = file =>
{
  const originalname = file.originalname.includes('.') ? file.originalname.split('.').slice(0, -1).join('.') : file.originalname;
  const ext = file.mimetype.split('/')[1];
  const newFilename = `${originalname}-${Date.now()}.${ext}`;
  fileNames.push(newFilename);
  
  return newFilename;
};

const multerStorage = multer.diskStorage(
{
  destination: (req, file, cb) =>
  {
    cb(null, `public/albums/${req.body.album.toLowerCase()}`);
  },
  filename: (req, file, cb) => cb(null, setFilename(file))
});

const multerFilter = (req, file, cb) =>
{
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Invalid file type. Only images are allowed', 400), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhotos = upload.array('documents');

exports.getPhotosList = asyncCatch(async (req, res, next) =>
{
  let query = Photo.find();

  if (req.body.skip) query.skip(req.body.skip);

  if (req.body.limit) query.limit(req.body.limit);

  const photos = await query;
  
  res.status(200).json(
  {
    status: 'success',
    results: photos.length,
    data: { photos }
  });
});

exports.savePhotosDetails = asyncCatch(async (req, res, next) =>
{
  const newPhotos = [];
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  for (let i = 0; i < req.files.length; i++)
  {
    const { album } = req.body;
    const photoObject =
    {
      album: album.toLowerCase(),
      name: fileNames[i],
      path: `/albums/${album}/${fileNames[i]}`,
      raw: `${fullUrl}/${album}/${fileNames[i]}`
    };
    await Photo.create(photoObject);
    newPhotos.push({ ...photoObject, album: album });
  }
  fileNames = [];

  res.status(201).json(
  {
    message: 'OK',
    data: newPhotos
  });
});

exports.deletePhoto = asyncCatch(async (req, res, next) =>
{
  const photo = await Photo.findOneAndDelete(req.params);

  if (!photo) return next(new AppError('💥 Photo does not exist!', 404));

  await fs.unlink('./public' + photo.path, err =>
  {
    if (err) return next(new AppError(`💥 Error encountered deleting ${photo.name}!`));

    console.log(`${photo.name} is deleted.`);
  });

  // res.status(204).send();
  res.status(200).json({ message: 'OK' });
});

exports.getPhoto = asyncCatch(async (req, res, next) =>
{
  const photo = await Photo.findOne(req.params);
  
  if (!photo) return next(new AppError('💥 Photo does not exist!', 404));

  const readable = fs.createReadStream(`./public${photo.path}`);
  readable.on('data', chunk =>
  {
    res.write(chunk);
  });
  
  readable.on('end', () => res.end());
});

exports.deletePhotos = asyncCatch(async (req, res, next) =>
{
  

  res.status(204).send();
});

const deletePhoto = asyncCatch(async params =>
{
  const photo = await Photo.findOneAndDelete(params);

  if (!photo) return next(new AppError('💥 Photo does not exist!', 404));

  await fs.unlink('./public' + photo.path, err =>
  {
    if (err) return next(new AppError(`💥 Error encountered deleting ${photo.name}!`));

    console.log(`${photo.name} is deleted.`);
  });
});