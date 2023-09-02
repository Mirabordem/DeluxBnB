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
    spotId: 2,
    userId: 1,
    startDate: '2022-11-15',
    endDate: '2022-11-20'
  },
  {
    spotId: 3,
    userId: 2,
    startDate: '2023-03-10',
    endDate: '2023-03-17'
  },
  {
    spotId: 1,
    userId: 3,
    startDate: '2023-02-05',
    endDate: '2023-02-10'
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
