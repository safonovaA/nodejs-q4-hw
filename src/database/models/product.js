'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
    amount: DataTypes.INTEGER,
  }, {});
  Product.associate = function(models) {
    Product.hasMany(models.Review, {
      foreignKey: 'productId',
      as: 'reviews',
      sourceKey: 'id',
    });
  };
  return Product;
};