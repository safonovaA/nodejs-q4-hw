'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    content: DataTypes.STRING,
    score: DataTypes.STRING,
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      targetKey: 'id',
    });
  };
  return Review;
};