'use strict';

const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

const allSpotImages = [
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/aabc73e7-d2ec-4a3e-8cd2-5261fad11fc0.jpg?im_w=1200",
    preview: true
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/157d232b-a6c2-42c8-91c8-ee2bea67b952.jpg?im_w=1440",
    preview: false
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/6f9c6706-2939-4dc2-8790-b2b3f7571c32.jpg?im_w=1440",
    preview: false
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-665819087296104155/original/16e8a55a-14d0-458b-abfc-570d748d67ab.jpeg?im_w=1440",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-752812878873332322/original/f79b0ce2-cd0f-44a2-8037-b42c82c754a1.jpeg?im_w=1200",
    preview: true
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-752812878873332322/original/46aff77d-91b9-4c3d-b285-9d8a14441680.jpeg?im_w=1440",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-752812878873332322/original/1143d949-e117-4460-b05d-3e141788589a.jpeg?im_w=1440",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-752812878873332322/original/5155943a-0bc4-484c-95d8-c03be7d4c3c9.jpeg?im_w=1440",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/e7e72c42-3268-4e06-992b-bb75b6aa0a00.jpg?im_w=1200",
    preview: true
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/23eafce5-8cc1-483d-88b1-716c1fa89deb.jpeg?im_w=1440",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/a5f9a4b8-18dd-4fb0-bb12-410fed496619.png?im_w=1440",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-46677438/original/799d80d0-85e9-48dc-bd35-b18db228d87b.jpeg?im_w=1440",
    preview: false
  },

]



module.exports = {
  async up (queryInterface, Sequelize) {
      await SpotImage.bulkCreate(allSpotImages, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options)
  }
};
