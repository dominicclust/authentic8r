'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {email: 'emma@demo.com', username: 'iEmmaDemo', hashedPassword: bcrypt.hashSync('password1')},
      {email: 'demo@user.io', username: 'Demo-lition', hashedPassword: bcrypt.hashSync('password2')},
      {email: 'user1@user.io', username: 'Fakerrr', hashedPassword: bcrypt.hashSync('password3')}
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['iEmmaDemo', 'Demo-lition', 'Fakerrr'] }
    }, {});
  }
};
