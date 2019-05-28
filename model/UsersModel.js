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

const testConnection = () => {
  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}

const createTable = () => {
  Users.sync({ force: true }).then(() => {
    return Users.create({
      user_id: 0,
      credits: 0
    });
  });
}

const findUser = (user_id, callback) => {
  Users.findOne({ where: { user_id: user_id } }).then(user => {
    user && console.log("Found the user:", user.user_id);
    callback(user);
  });
}

const allUsers = () => {
  Users.findAll().then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
  });
}

const createUser = (user_id) => {
  Users.create({ user_id: user_id }).then(user => {
    console.log("new user:", user);
  });
}

const updateUser = (user_id, credits) => {
  // Change everyone without a last name to "Doe"
  Users.update({ credits: credits }, {
    where: {
      user_id: user_id
    }
  }).then(() => {
    console.log("Done");
  });
}

const destroyUser = (user_id) => {
  User.destroy({
    where: {
      user_id: user_id
    }
  }).then(() => {
    console.log("Done");
  });
}

module.exports.testConnection = testConnection;
module.exports.findUser = findUser;
module.exports.createTable = createTable;
module.exports.createUser = createUser;
module.exports.findUser = findUser;
module.exports.allUsers= allUsers;
module.exports.destroyUser = destroyUser;
module.exports.updateUser = updateUser;
