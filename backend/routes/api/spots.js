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


//___________________________________________________________________

// GET ALL SPOTS:


router.get('/', async(req, res) => {

  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

// parsing query filters to ensure they are valid numbers:
   page = parseInt(page);
   size = parseInt(size);
   minLat = parseFloat(minLat);
   maxLat = parseFloat(maxLat);
   minLng = parseFloat(minLng);
   maxLng = parseFloat(maxLng);
   minPrice = parseFloat(minPrice);
   maxPrice = parseFloat(maxPrice);


// pagination:
   if(page <= 0) {
     res.status(400);
     return res.json({message: "Bad Request: Page must be greater than or equal to 1"})
   };

   if(size <= 0) {
     res.status(400);
     return res.json({message: "Bad Request: Size must be greater than or equal to 1"})
   };



   if(!page || Number.isNaN(page) || page > 10) page = 1;
   if(!size || Number.isNaN(size) || size > 20) size = 20;

   let pagination = {};
   pagination.limit = size;
   pagination.offset = size * (page - 1);


// other query filters:
 const filterQuery = {};
   if (!isNaN(minLat)) filterQuery.minLat = minLat;
   if (!isNaN(maxLat)) filterQuery.maxLat = maxLat;
   if (!isNaN(minLng)) filterQuery.minLng = minLng;
   if (!isNaN(maxLng)) filterQuery.maxLng = maxLng;
   if (!isNaN(minPrice)) filterQuery.minPrice = minPrice;
   if (!isNaN(maxPrice)) filterQuery.maxPrice = maxPrice;


// finding all spots:
  const spots = await Spot.findAll({
    include: [{model: SpotImage}, { model: Review}],
    where: filterQuery,
    ...pagination
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
      spot.avgRating = spot.avgRating.toFixed(1)

      delete spot.Reviews;
  });

  res.status(200);
  return res.json({Spots: allSpots, page, size})
});


//___________________________________________________________________

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


//___________________________________________________________________

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


//___________________________________________________________________

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


// // finding numReviews and avgStarRating:
//   let numReviews = jsonReviews.length;

//   let starSum = 0; //starting to collect
//   jsonReviews.forEach(review => {
//     starSum += review.stars
//   })
//   let avgStars = starSum / numReviews;
//   avgStars = avgStars.toFixed(1)

//   spot.numReviews = numReviews;
//   spot.avgStarRating = avgStars;



// finding numReviews and avgStarRating:
let numReviews = jsonReviews.length;
let starSum = 0;

jsonReviews.forEach((review) => {
  starSum += review.stars;
});

let avgStars = 0;

if (numReviews > 0) {
  avgStars = starSum / numReviews;
  avgStars = avgStars.toFixed(2);
}

spot.numReviews = numReviews;
spot.avgStarRating = avgStars;



// finding spot images:
  let images = await SpotImage.findAll({
    where: {
      spotId: req.params.spotId
    },
    attributes: ['id', 'url', 'preview']
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


//___________________________________________________________________

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


//___________________________________________________________________

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


//___________________________________________________________________

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


//___________________________________________________________________

  // CREATE REVIEW FOR SPOT BY ID:


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


//___________________________________________________________________

// GET ALL REVIEWS BY SPOT'S ID:


  router.get('/:spotId/reviews', async(req, res) => {

    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [
        {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
    });

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      res.status(404);
      return res.json({message: "Spot couldn't be found"});
    };

    let reviewsJson = [];
     reviews.forEach(review => {
      reviewsJson.push(review.toJSON())
      })


      res.status(200);
      return res.json({Reviews: reviewsJson})
  })


//___________________________________________________________________

// CREATE BOOKING OF A SPOT BY ID:


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
      return res.json({ message: "Forbidden: user owns this spot." });
    }


// find all bookings of this spot:
    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      }
    });


// time conflict in bookings:
    let conflict = false;

    const userStart = new Date(req.body.startDate);
    const userEnd = new Date(req.body.endDate);


    const numUserStart = userStart.getTime(); // number to compare
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

    // console.log('Original startDate:', startDate);
    // console.log('Original endDate:', endDate);

// format dates as 'YYYY-MM-DD' strings
    // const formattedStartDate = userStart.toISOString().slice(0, 10);
    // const formattedEndDate = userEnd.toISOString().slice(0, 10);

    const formattedStartDate = userStart.toDateString();
    const formattedEndDate = userEnd.toDateString();


    // console.log('Formatted startDate:', formattedStartDate);
    // console.log('Formatted endDate:', formattedEndDate);



    const createBooking = await spot.createBooking({
      spotId: parseInt(req.params.spotId),
      userId: parseInt(user.id),
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

    res.status(200);
    return res.json(createBooking);
   });


//___________________________________________________________________

// GET ALL BOOKINGS FOR SPOT BY ID:


  router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const {user} = req;

    const spot = await Spot.findByPk(req.params.spotId)

    if(!spot) {
      res.status(404);
      res.json({message: "Spot couldn't be found"})
    }


// response for not the spot owner:
    if (user.id !== spot.ownerId) {
      const bookings = await Booking.findAll({
        where: {
          spotId: req.params.spotId},
          attributes: ['spotId', 'startDate', 'endDate']
      })
      let bookingsJson = [];
      bookings.forEach(booking => bookingsJson.push(booking.toJSON()));

      bookingsJson.forEach(booking => {
        let startDate = JSON.stringify(booking.startDate);
        booking.startDate = startDate.slice(1,11);

        let endDate = JSON.stringify(booking.endDate);
        booking.endDate = endDate.slice(1,11);
      })

      res.status(200);
      return res.json({Bookings: bookingsJson})
    }

// response for the spot owner:
    if(user.id === spot.ownerId) {
      const bookings = await Booking.findAll({
        where: {
          spotId: req.params.spotId
        },
        include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    });

      let ownerBookingsJson = [];
      bookings.forEach(booking => {
        ownerBookingsJson.push(booking.toJSON())
      });

      ownerBookingsJson.forEach(booking => {
        let startDate = JSON.stringify(booking.startDate);
        booking.startDate = startDate.slice(1,11);

        let endDate = JSON.stringify(booking.endDate);
        booking.endDate = endDate.slice(1,11);

        let createdAt = JSON.stringify(booking.createdAt);
        createdAt = createdAt.slice(1, 20);
        booking.createdAt = createdAt.split("T").join(" ");

        let updatedAt = JSON.stringify(booking.updatedAt);
        updatedAt = updatedAt.slice(1, 20);
        booking.updatedAt = updatedAt.split("T").join(" ");
      })

      res.status(200);
      res.json({Bookings: ownerBookingsJson})
    };
  })


  //___________________________________________________________________






module.exports = router;
