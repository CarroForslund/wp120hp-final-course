'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class EQString extends Sequelize.Model {}
  EQString.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    word: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide a word',
            },
            notEmpty: {
                msg: "Please provide a word",
            },
        },
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    language_code: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'sv-SE',
    },
  }, { sequelize });

  EQString.associate = (models) => {
    EQString.belongsTo(models.EQTranslation, { foreignKey: 'translation_id' });
  };

  return EQString;
};