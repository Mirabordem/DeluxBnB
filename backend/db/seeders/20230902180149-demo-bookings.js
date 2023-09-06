'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allBookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: '2022-11-15',
    endDate: '2022-11-20'
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2023-03-10',
    endDate: '2023-03-17'
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '2023-02-05',
    endDate: '2023-02-10'
  },
  {
    spotId: 4,
    userId: 4,
    startDate: '2023-03-15',
    endDate: '2023-03-20'
  },
  {
    spotId: 5,
    userId: 5,
    startDate: '2023-04-10',
    endDate: '2023-04-15'
  },
  {
    spotId: 6,
    userId: 6,
    startDate: '2023-05-25',
    endDate: '2023-05-30'
  },
  {
    spotId: 7,
    userId: 7,
    startDate: '2023-06-12',
    endDate: '2023-06-17'
  },
  {
    spotId: 8,
    userId: 8,
    startDate: '2023-07-08',
    endDate: '2023-07-13'
  },
  {
    spotId: 7,
    userId: 8,
    startDate: '2023-08-20',
    endDate: '2023-08-25'
  },
  {
    spotId: 8,
    userId: 5,
    startDate: '2023-09-04',
    endDate: '2023-09-09'
  }
];


module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate(allBookings, {validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options)
  }
};
