const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();


// GET ALL SPOTS:

router.get('/', async(req, res) => {
    const spots = await Spot.findAll({
        include: [{model: SpotImage}, { model: Review}]  // spot data includes previewImage, and avgRating
    })

    let allSpots = [];
    spots.forEach(spot => {
  allSpots.push(spot.toJSON())
});


 // set previewImage:
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

// get avgRating, aggregate data:
allSpots.forEach(spot => {
    spot.avgRating = 0; // starting point to add
    spot.Reviews.forEach(review => {
        spot.avgRating += review.stars;
    })
      spot.avgRating = spot.avgRating / spot.Reviews.length
      delete spot.Reviews;
  });

  res.status(200);
  return res.json({Spots: allSpots})
});



// CREATE A SPOT:

router.post('/',
requireAuth,  // middleware from auth file - authentication required
  async(req, res) => {
    const { user } = req; // safe user from Auth
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



// GET ALL SPOTS OWNED BY CURRENT USER:

router.get('/current',
requireAuth,
async(req, res) => {
const {user} = req;      // added to req object after passing

const spots = await Spot.findAll({
  where: {
    ownerId: user.id      //  only spots created by current user
  },
  include: [SpotImage, Review]  // spot data includes previewImage, and avgRating
});


let allSpots = [];
  spots.forEach(spot => {
    allSpots.push(spot.toJSON())
});

  // set previewImage:
  allSpots.forEach(spot => {
    spot.SpotImages.forEach(image => {
      if(image.preview) {
        spot.previewImage = image.url
      }
    })
    if(!spot.previewImage) {
      spot.previewImage = 'No preview image.'
    }
    delete spot.SpotImages;
  })

    // get avgRating, aggregate data:
    allSpots.forEach(spot => {
      spot.avgRating = 0;
      spot.Reviews.forEach(review => {
          spot.avgRating += review.stars;
      })
        spot.avgRating = spot.avgRating / spot.Reviews.length
        delete spot.Reviews;
    });

  return res.json({Spots: allSpots})
});



// GET DETAILS OF A SPOT FROM AN ID:

router.get('/:spotId', async(req, res) => {
  let spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    res.status(404);
    res.json({message: 'Spot couldn\'t be found.'})
  }
  spot = spot.toJSON();





  res.json(spot);
})











module.exports = router;
