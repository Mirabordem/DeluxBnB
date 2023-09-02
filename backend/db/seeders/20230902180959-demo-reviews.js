'use strict';

const { Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allReviews = [
  {
    spotId: 3,
    userId: 1,
    review: 'This cabin was absolutely amazing! The perfect place for a quiet and relaxing getaway in the woods.',
    stars: 5
  },
  {
    spotId: 3,
    userId: 3,
    review: 'The beachfront villa exceeded our expectations. The view and amenities were incredible. Highly recommended!',
    stars: 5
  },
  {
    spotId: 1,
    userId: 2,
    review: 'Had a great time at this urban loft. The location was perfect, and the loft had a stylish and comfortable vibe.',
    stars: 4
  },
  {
    spotId: 2,
    userId: 2,
    review: 'This mountain retreat was a slice of paradise. The peaceful surroundings and cozy cabin made for a memorable stay.',
    stars: 5
  },
  {
    spotId: 2,
    userId: 3,
    review: 'Our lakeside getaway was incredible. The spot was clean, well-equipped, and the lake view was breathtaking.',
    stars: 4
  },
  {
    spotId: 1,
    userId: 3,
    review: 'Enjoyed our stay at the city view loft. The location was convenient, and the loft offered stunning cityscape views.',
    stars: 4
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
      await Review.bulkCreate(allReviews, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options)
  }
};
