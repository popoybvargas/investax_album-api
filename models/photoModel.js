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
    required: [ true, 'Path to the photo must be specified' ]
  },
  raw:
  {
    type: String,
    required: [ true, 'URL to the photo must be specified' ],
    lowercase: true
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const uppercaseInitial = str => str.charAt(0).toUpperCase() + str.slice(1);

schema.post(/^find/, function(docs, next)
{
  for (let i = 0; i < docs.length; i ++)
  {
    const { album, path } = docs[i];
    docs[i].album = uppercaseInitial(album);
    docs[i].path = path.replace(album, uppercaseInitial(album));
  }
  
  next();
});

const Photo = mongoose.model('Photo', schema);

module.exports = Photo;