const mongoose = require('mongoose');

const schema = new mongoose.Schema(
{
  album:
  {
    type: String,
    required: [ true, 'A photo must belong to an album' ],
    enum:
    {
      values: [ 'travel', 'personal', 'food', 'nature', 'other' ],
      message: 'Valid albums: Travel, Personal, Food, Nature, Other'
    },
    unique: false
  },
  name:
  {
    type: String,
    required: [ true, 'A photo must have a name' ],
    lowercase: true
  },
  path:
  {
    type: String,
    required: [ true, 'Path to the photo must be specified' ],
    lowercase: true
  },
  raw:
  {
    type: String,
    required: [ true, 'Full path to the photo must be specified' ],
    lowercase: true
  }
// },
// {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
});

schema.virtual('albumDisplay').get(function()
{
  return this.album.charAt(0).toUpperCase() + this.album.slice(1);
});

schema.virtual('pathDisplay').get(function()
{
  return this.path.replace(this.album, this.album.charAt(0).toUpperCase() + this.album.slice(1));
  // return this.path.charAt(0).toUpperCase() + this.path.slice(1);
});

// schema.pre(/^find/, function(next)
// {
//   this.start = Date.now();
//   this.find({ secretTour: { $ne: true } });

//   next();
// });

// schema.post(/^find/, function(docs, next)
schema.post('find', function(docs, next)
{
  for (let i = 0; i < docs.length; i ++)
  {
    docs[i].album = docs[i].albumDisplay;
    docs[i].path = docs[i].pathDisplay;
    docs[i].__v = undefined;
  }
  
  next();
});

const Photo = mongoose.model('Photo', schema);

module.exports = Photo;