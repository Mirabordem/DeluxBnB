const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Review } = require('../../db/models');
const { User } = require('../../db/models');
const { ReviewImage } = require('../../db/models');
const { Booking } = require('../../db/models');


const router = express.Router();


// get all spots
router.get('/', async(req, res) => {
    const spots = await Spot.findAll({
        include: [{model: SpotImage}, { model: Review}]
    })

    let allSpots = [];
    spots.forEach(spot => {
  allSpots.push(spot.toJSON())
});

// get average rating
allSpots.forEach(spot => {
    spot.avgRating = 0;
    spot.Reviews.forEach(review => {
        spot.avgRating += review.stars;
    })
      spot.avgRating = spot.avgRating / spot.Reviews.length
      delete spot.Reviews;
  });

   // get preview Image
   allSpots.forEach(spot => {
    spot.SpotImages.forEach(image => {
      if(image.preview) {
        spot.previewImage = image.url
      }
    })
    if(!spot.previewImage) {
      spot.preview = 'No preview image.'
    }
    delete spot.SpotImages;
  })

  res.status(200);
  return res.json({Spots: allSpots})
});


// create a spot
router.post('/',
requireAuth,
// validateSpot,
  async(req, res) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if(user) {
    const createSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });
    res.status(201);
    return res.json(createSpot)
  } else {
    res.status(404);
    return res.json({ user: null })
  }
});







module.exports = router;
