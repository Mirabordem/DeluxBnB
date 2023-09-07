const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();


// GET ALL OF CURRENT USER BOOKINGS:

router.get('/current', requireAuth, async (req, res) => {
    const {user} = req;

    const bookings = await Booking.findAll({
        where: {
          userId: user.id      //  only spots created by current user
        },
        include: [
            {
                model: Spot,
                attributes: {exclude: ['description', 'updatedAt', 'createdAt']},
                include: [SpotImage]
            }
        ]
      });

      let allBookings = [];
        bookings.forEach(booking => {
        allBookings.push(booking.toJSON())
      });

// add reviewImage:
      allBookings.forEach(booking => {
        for(let key in booking.Spot) {
          booking.Spot.SpotImages.forEach(spot => {
            if(spot.preview) {
              booking.Spot.previewImage = spot.url
            }
          })
        }
        delete booking.Spot.SpotImages
      })

        return res.json({Bookings: allBookings})
      });



// EDIT AN EXISTING BOOKING:

  router.put('/:bookingId', requireAuth, async (req, res) => {
    const {user} = req;
    const {startDate, endDate} = req.body;

    const booking = await Booking.findByPk(req.params.bookingId);

    if(!booking) {
        res.status(404);
        res.json({message: "Booking couldn't be found"})
    };







})










module.exports = router;
