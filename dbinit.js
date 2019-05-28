const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgresql://localhost:5432/ellinia');

const Users = sequelize.define('users', {
  user_id: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  credits: {
    type: Sequelize.BIGINT,
    default: 0
  }
});
Users.sync({ force: true }).then(() => {
  return Users.create({
    user_id: 0,
    credits: 0
  });
});