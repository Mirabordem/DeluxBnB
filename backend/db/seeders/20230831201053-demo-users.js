'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Frank',
        lastName: 'Wright',
        email: 'fraewright34@gmail.com',
        username: 'fruueunk',
        hashedPassword: bcrypt.hashSync('password12')
      },
      {
        firstName: 'Tom',
        lastName: 'Long',
        email: 'tomlongtgg54@gmail.com',
        username: 'Longgggfomy',
        hashedPassword: bcrypt.hashSync('password21')
      },
      {
        firstName: 'Anna',
        lastName: 'Doe',
        email: 'aniadioei@gmail.com',
        username: 'annAsdoE65',
        hashedPassword: bcrypt.hashSync('password34')
      },
      {
        firstName: "John",
        lastName: "Smithy",
        email: "johnsmit8h2@gmail.com",
        username: "johns9mith2",
        hashedPassword: bcrypt.hashSync("password48")
      },
      {
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily.j@gmail.com",
        username: "emilyj",
        hashedPassword: bcrypt.hashSync("password5")
      },
      {
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.b@gmail.com",
        username: "michaelb",
        hashedPassword: bcrypt.hashSync("password6")
      },
      {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.w@gmail.com",
        username: "sarahw",
        hashedPassword: bcrypt.hashSync("password7")
      },
      {
        firstName: "Daniel",
        lastName: "Lee",
        email: "daniel.lee@gmail.com",
        username: "daniell",
        hashedPassword: bcrypt.hashSync("password8")
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demolition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
