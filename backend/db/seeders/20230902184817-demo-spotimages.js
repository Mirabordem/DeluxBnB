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
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-37141484/original/0dfabcb0-e19c-46bb-88eb-e10f4b2e47cf.jpeg?im_w=1200",
    preview: true
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-37141484/original/e5dba6aa-5a98-4c74-b4cd-b49269c186bb.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-37141484/original/43c79372-5c3c-47e8-9016-9bfa75dc9c60.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-37141484/original/2bf4de49-d7eb-48de-bb9f-aeefef7def2d.png?im_w=720",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/89185860/36831035_original.jpg?im_w=1200",
    preview: true
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/d55a04ba-3d51-474d-854e-64799dfa53c7.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/03b5ebbc-ce07-4310-bc84-390bb7774c2c.jpg?im_w=720",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/76212243/d032fe38_original.jpg?im_w=720",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/80704117/27b55c71_original.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/0e76bcbb-12eb-40f3-ac46-a9308ab7aa6f.jpg?im_w=1200",
    preview: true
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/df57c781-6434-4f0a-9a7d-ee8ab20da8fe.jpg?im_w=720",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/0307d093-92b1-4ed9-a587-95d56d20854f.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/51e44488-a2a0-4548-ab98-c1e21f566853.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-49038059/original/4daf74d0-3585-4612-9191-e380f9291514.jpeg?im_w=1200",
    preview: true
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/b1704a2c-bbdd-4f84-9e95-278a4d370be3.jpg?im_w=720",
    preview: false
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-49038059/original/9ab1db0f-3c20-4bcd-862a-103e9b9eda9d.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 7,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-49038059/original/90ce3892-7d3d-4486-8210-b81efd49da21.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-43880113/original/38a62da2-1b1d-41e4-a43e-d4aa1d5d2dc4.jpeg?im_w=1200",
    preview: true
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-43880113/original/48e86f3a-2078-44b3-b4f9-199ab58813b6.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-43880113/original/a2d9981d-5c61-4205-8b78-5edb37ebdcca.jpeg?im_w=1200",
    preview: false
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-43880113/original/06236acd-bb74-469e-8379-82958505f06b.jpeg?im_w=1200",
    preview: false
  },
  {
    spotId: 8,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-43880113/original/2a6d9cb2-7ed5-4761-8e9e-d9dc86c6b2b9.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 9,
    url: "https://a0.muscache.com/im/pictures/7ba6fc29-c32d-4a0c-b045-f7b4ff2e58df.jpg?im_w=1200",
    preview: true
  },
  {
    spotId: 9,
    url: "https://a0.muscache.com/im/pictures/aa2906a4-d80f-4ff3-819b-4e2cf617b51f.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 9,
    url: "https://a0.muscache.com/im/pictures/b2bc670e-e21f-469d-87b2-6af2db92cddb.jpg?im_w=1200",
    preview: false
  },
  {
    spotId: 9,
    url: "https://a0.muscache.com/im/pictures/ab687592-3a09-4e4f-808a-f759389f9a90.jpg?im_w=720",
    preview: false
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-777565674691883637/original/8eb7d56f-7bb6-45e7-a51d-7dbc84708257.jpeg?im_w=1200",
    preview: true
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-777565674691883637/original/fbfd9026-47bc-43cf-b469-68a314abece8.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-777565674691883637/original/4b1803c2-e2f3-425d-b8bf-e30207519c20.jpeg?im_w=720",
    preview: false
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-777565674691883637/original/6044af5a-2419-4dbd-b6a2-a742ebdb8ff3.jpeg?im_w=1200",
    preview: false
  },
  {
    spotId: 10,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-777565674691883637/original/43363ecd-2262-476f-bd4f-bcc8a1ab041c.jpeg?im_w=720",
    preview: false
  }
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
