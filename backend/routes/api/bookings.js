const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();


//___________________________________________________________________

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


//___________________________________________________________________

// EDIT/UPDATE AN EXISTING BOOKING:


router.put('/:bookingId', requireAuth, async (req, res) => {
    try {
      const { user } = req;
      const { startDate, endDate } = req.body;

      // Find the booking by ID
      const booking = await Booking.findByPk(req.params.bookingId);

      // Handle case where booking is not found
      if (!booking) {
        res.status(404);
        return res.json({ message: "Booking couldn't be found" });
      }

      // Validate ownership of the booking
      if (booking.userId !== user.id) {
        res.status(403);
        return res.json({ message: "Forbidden" });
      }

      // Validate if it's past the booking's endDate
      const currentDate = new Date();
      if (currentDate > new Date(booking.endDate)) {
        res.status(400);
        return res.json({ message: "Bad Request: endDate cannot come before startDate" });
      }

      // Check for booking conflicts
      let conflict = false;
      const spot = await Spot.findByPk(booking.spotId);
      const spotBookings = await spot.getBookings();

      const numStart = new Date(startDate).getTime();
      const numEnd = new Date(endDate).getTime();

      for (const booking of spotBookings) {
        const formatStart = JSON.stringify(booking.startDate);
        const formatEnd = JSON.stringify(booking.endDate);
        const bookedStart = new Date(formatStart.slice(1, 11)).getTime();
        const bookedEnd = new Date(formatEnd.slice(1, 11)).getTime();

        if (bookedStart <= numStart && numStart <= bookedEnd) {
          conflict = true;
          break;
        }
        if (numStart <= bookedStart && bookedStart <= numEnd && numEnd <= bookedStart) {
          conflict = true;
          break;
        }
        if (numStart <= bookedStart && numEnd >= bookedStart) {
          conflict = true;
          break;
        }
      }

      if (conflict) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      // Update the booking
      booking.startDate = startDate;
      booking.endDate = endDate;
      await booking.save();

      // Return the updated booking data
      res.status(200);
      return res.json({
        id: booking.id,
        userId: booking.userId,
        spotId: booking.spotId,
        startDate: startDate.toISOString().slice(0, 10), // format as YYYY-MM-DD
        endDate: endDate.toISOString().slice(0, 10), // format as YYYY-MM-DD
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({ message: "Internal Server Error" });
    }
  });


  //___________________________________________________________________

  // DELETE A BOOKING:














module.exports = router;
