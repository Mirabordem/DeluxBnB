'use strict';

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allReviewImages = [
  {
    reviewId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/f7106e86-21ae-4b12-b484-045c7ffe36aa.jpeg?im_w=1440"
  },
  {
    reviewId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/f521ff28-1525-48c9-8e95-34216c6ae021.jpeg?im_w=1440"
  },
  {
    reviewId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/8fff33f0-f7f5-40b1-a3c4-2bf66c9493e0.png?im_w=1440"
  },
]



module.exports = {
  async up (queryInterface, Sequelize) {
      await ReviewImage.bulkCreate(allReviewImages, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options)
  }
};
