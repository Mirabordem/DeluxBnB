const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const router = express.Router();


const validateReview = [
  check('review')
  .exists({ checkFalsy: true })
  .isString()
  .withMessage('Review text is required and must be a string'),
  check('stars')
  .exists({ checkFalsy: true })
  .isNumeric()
  .isFloat({ min: 1, max: 5 })
  .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];


//___________________________________________________________________

// ADD IMAGE TO REVIEW BY ID:


router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const {user} = req;
    const {url} = req.body;

  // finding review:
    let review = await Review.findByPk(req.params.reviewId, {
        include: ReviewImage
    });

    if (!review) {
      res.status(404);
      return res.json({message: "Review couldn't be found"})
    }

  // confirming that user wrote this review:
    if (user.id !== review.userId) {
      res.status(403);
      return res.json({message: "Only author of this review can add a new image"})
    }

   // creating a new image in review:
    if (user.id === review.userId && review.ReviewImages.length < 10) {
      const image = await review.createReviewImage({
        url: url,
        reviewId: req.params.reviewId
      });

      await image.save();

      let response = {};
      response.id = image.id;
      response.url = image.url;

      res.status(200);
      res.json(response);
    } else if (review.ReviewImages.length >= 10) {
        res.status(403);
        return res.json({message: "Maximum number of images for this resource was reached"})
    };
  })


//___________________________________________________________________

// GET ALL REVIEWS OF CURRENT USER:


router.get('/current', requireAuth, async(req, res) => {
    const {user} = req;

    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: {
                    model: SpotImage
                }
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
    });

 // add reviewImage:
    reviewsJson.forEach(review => {
    for(let key in review.Spot) {
      review.Spot.SpotImages.forEach(spot => {
        if(spot.preview) {
          review.Spot.previewImage = spot.url
        }
      })
    }
    delete review.Spot.SpotImages
  })

    if(reviewsJson.length === 0) {
        res.status(404)
        return res.json({message: 'No reviews found.'})
      }

    res.status(200);
    return res.json({Reviews: reviewsJson})
  })


//___________________________________________________________________

// EDIT REVIEW:


router.put('/:reviewId', requireAuth, validateReview, async(req, res) => {
    const {user} = req;
    const {review, stars} = req.body;

    let newReview = await Review.findByPk(req.params.reviewId);

    if (!newReview) {
      res.status(404);
      res.json({message: "Review couldn't be found"})
    };

    if (!user) {
        return res.json({user: null})
      };

    if (user) {
       if (user.id === newReview.userId) {
          newReview.review = review,
          newReview.stars = stars

          await newReview.save();

          res.status(200);
          res.json(newReview)

        } else if (user.id !== newReview.ownerId) {
          res.status(403);
          return res.json({message: "Forbidden"})
        }
      }
})


//___________________________________________________________________

// DELETE REVIEW:


  router.delete('/:reviewId', requireAuth, async(req, res) => {
    const {user} = req;

    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
      res.status(404);
      return res.json({message: "Review couldn't be found"});
    }
    if (!user) {
      return res.json({user: null});
    }
    if (user) {
      if (user.id === review.userId) {
        await review.destroy();
        res.status(200);
        return res.json({message: "Successfully deleted"})
      } else if (user.id !== review.userId) {
        res.status(403);
        return res.json({message: "Only owner can delete this review."})
      }
    }
  })

  //___________________________________________________________________










  module.exports = router;
