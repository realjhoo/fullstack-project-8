const Sequelize = require("sequelize");

module.exports = sequelize => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Title cannot be blank!"
          },
          notEmpty: {
            msg: "Title cannot be blank!"
          }
        }
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Author cannot be blank!"
          },
          notEmpty: {
            msg: "Author cannot be blank!"
          }
        }
      },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
    },
    { sequelize }
  );
  return Book;
};
