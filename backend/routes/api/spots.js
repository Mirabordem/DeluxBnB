const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();


const validateSpot = [

  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid address'),
  check('city')
    .exists( {checkFalsy: true })
    .withMessage('Please provide a valid city name'),
  check('state')
    .exists( {checkFalsy: true })
    .withMessage('Please provide a valid state'),
  check('country')
    .exists( {checkFalsy: true })
    .withMessage('Please provide a valid country'),
  check('lat')
    .exists( {checkFalsy: true })
    .isNumeric()
    .withMessage('Please provide a valid latitude'),
  check('lng')
    .exists( {checkFalsy: true })
    .isNumeric()
    .withMessage('Please provide a valid longitude'),
  check('name')
    .exists( {checkFalsy: true })
    .isLength({min:2, max: 50})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists( {checkFalsy: true })
    .withMessage('Please provide a valid description'),
  check('price')
    .exists( {checkFalsy: true })
    .isNumeric()
    .withMessage('Please provide a valid price per day'),
    handleValidationErrors
];

const validateReview = [
  check('review')
  .exists({ checkFalsy: true })
  .withMessage('Review text is required'),
  check('stars')
  .exists({ checkFalsy: true })
  .isNumeric()
  .isFloat({ min: 1, max: 5 })
  .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];



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
      spot.avgRating = spot.avgRating.toFixed(0)

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
        spot.avgRating = spot.avgRating.toFixed(0)
        delete spot.Reviews;
    });

  return res.json({Spots: allSpots})
});



// GET DETAILS OF A SPOT FROM AN ID:

router.get('/:spotId', async(req, res) => {

  let spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    res.status(404);
    res.json({message: "Spot couldn't be found."})
  }
  spot = spot.toJSON();


// finding all reviews for this spotId:
  let reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  let jsonReviews = [] // translate every review to json object
  reviews.forEach(review => {
    jsonReviews.push(review.toJSON())
  })


// finding numReviews and avgStarRating:
  let numReviews = jsonReviews.length;

  let starSum = 0; //starting to collect
  jsonReviews.forEach(review => {
    starSum += review.stars
  })
  let avgStars = starSum / numReviews;
  avgStars = avgStars.toFixed(0)

  spot.numReviews = numReviews;
  spot.avgStarRating = avgStars;


// finding spot images:
  let images = await SpotImage.findAll({
    where: {
      spotId: req.params.spotId
    }
  });
  spot.SpotImages = images;


// finding owner info:
  let owner = await User.findByPk(spot.ownerId, {
    attributes: ['id', 'firstName', 'lastName']
  });
  spot.Owner = owner;


  res.status(200);
  res.json(spot);
})



// ADD IMAGE TO SPOT BY ID:

  router.post('/:spotId/images', requireAuth, async(req, res) => {
  const {user} = req;
  const {url, preview} = req.body;

// finding spot:
  let spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404);
    return res.json({message: "Spot couldn't be found"})
  }

// confirming that user owns the spot:
  if (user.id !== spot.ownerId) {
    res.status(403);
    return res.json({message: "Only owner can add an image"})
  }


 // creating a new image in spot:
  if (user.id === spot.ownerId) {
    const image = await spot.createSpotImage({
      url: url,
      preview: preview
    });

    await image.save();

    let response = {};

    response.id = image.id;
    response.url = image.url;
    response.preview = image.preview;


    res.status(200);
    res.json(response);
  }
})


// EDIT A SPOT:

  router.put('/:spotId', requireAuth, validateSpot, async(req, res) => {
    const {user} = req;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    let spot = await Spot.findByPk(req.params.spotId);

    if (!user) {
      return res.json({user: null})
    };

    if (!spot) {
      res.status(404);
      res.json({message: "Couldn't find a Spot with the specified id"})
    };

    if (user) {
      if (user.id === spot.ownerId) {
        spot.address = address,
        spot.city = city,
        spot.state = state,
        spot.country = country,
        spot.lat = lat,
        spot.lng = lng,
        spot.name = name,
        spot.description = description,
        spot.price = price,

        await spot.save();

        res.status(200);
        res.json(spot)

      } else if (user.id !== spot.ownerId) {
        res.status(403);
        return res.json({message: "Forbidden"})
      }
    }
  })


// DELETE A SPOT:

  router.delete('/:spotId', requireAuth, async(req, res) => {
    const {user} = req;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.status(404);
      return res.json({message: "Spot couldn't be found"});
    }
    if (!user) {
      return res.json({user: null});
    }
    if (user) {
      if (user.id === spot.ownerId) {
        await spot.destroy();
        res.status(200);
        return res.json({message: "Successfully deleted"})
      } else if (user.id !== spot.ownerId) {
        res.status(403);
        return res.json({message: "Only owner can delete this spot."})
      }
    }
  })


  // CREATE REVIEW FOR SPOT BY ID

    router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res) => {
      const {user} = req;
      const {review, stars} = req.body;

      const spot = await Spot.findByPk(req.params.spotId);

      if (!spot) {
        res.status(404);
        return res.json({message: "Spot couldn't be found"});
      };

      const spotReviews = await Review.findAll({
        where: {
          spotId: req.params.spotId
        }
      });

      let spotReviewsJson = [];
      spotReviews.forEach(review => {
        spotReviewsJson.push(review.toJSON())
      })

      // check whether there is review by the current user:
      for (let review of spotReviewsJson) {
        if (review.userId === user.id) {
          res.status(403)
          return res.json({message: "User already has a review for this spot"})
        }
      };
          let newReview = await spot.createReview({
            userId: user.id,
            review,
            stars
          });

      res.status(201);
      return res.json(newReview)
    })


// GET ALL REVIEWS BY SPOT'S ID:

  router.get('/:spotId/reviews', async(req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.status(404);
      return res.json({message: "Spot couldn't be found"});
    };

    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
    })

    let reviewsJson = [];
    reviews.forEach(review => {
      reviewsJson.push(review.toJSON())
      })


      res.status(200);
      return res.json(reviewsJson)
  })




// CREATE BOOKING OF A SPOT:

//   router.post('/:spotId/bookings', requireAuth, async(req, res) => {
//     const {user} = req;
//     const {startDate, endDate} = req.body;


//     const spot = await Spot.findByPk(req.params.spotId);

//     if (!spot) {
//       res.status(404);
//       return res.json({message: "Spot couldn't be found"});
//     };

//     if (spot.ownerId === user.id) {
//       res.status(403);
//         return res.json({message: "Forbidden"})
//     };

// // finding all bookings for this spot:
//     const bookings = await Booking.findAll({
//       where: {
//         spotId: req.params.spotId
//       }
//     });


//  // checking whether there is a conflict in dates:
//     const userStart = new Date(startDate);
//     const userEnd = new Date(endDate);

//     let numStart = userStart.getTime();
//     let numEnd = userEnd.getTime();

//     if(numStart >= numEnd) {
//       res.status(400);
//       return res.json({
//         message: "Bad Request",
//         errors: {
//           endDate: "endDate cannot be on or before startDate"
//         }
//       })
//     };

   router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const {user} = req;
    const {startDate, endDate} = req.body;

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.status(404);
      return res.json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === user.id) {
      res.status(403);
      return res.json({ message: "Forbidden" });
    }


// find all bookings of this spot:
    const bookings = await Booking.findAll({ where: { spotId: req.params.spotId } });


// Working with dates - checking for time conflict in bookings:
    let conflict = false;

    const userStart = new Date(startDate);
    const userEnd = new Date(endDate);

    const numUserStart = userStart.getTime(); // creates a number to compare
    const numUserEnd = userEnd.getTime();


// checking dates of bookings of the spot:
    for (let booking of bookings) {
      const bookedStart = new Date(booking.startDate).getTime(); // number
      const bookedEnd = new Date(booking.endDate).getTime();

      
      if (numUserStart <= bookedEnd && numUserEnd >= bookedStart) {
        conflict = true;
      }
    }

    if (conflict) {
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking"
        }
      });
    }

    const createBooking = await spot.createBooking({
      spotId: parseInt(req.params.spotId),
      userId: parseInt(user.id),
      startDate,
      endDate
    });

    res.status(200);
    return res.json(createBooking);
   });
























module.exports = router;
