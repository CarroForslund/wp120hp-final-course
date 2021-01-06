'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class EQTranslation extends Sequelize.Model {}
  EQTranslation.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    string_id: Sequelize.INTEGER, //(FK, move to associations)
    group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Please provide a value for "group_id"',
            },
            notEmpty: {
              msg: 'Please provide a value for "group_id"',
            },
        },
    },
    language_code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Please provide a value for "language_code"',
            },
            notEmpty: {
              msg: 'Please provide a value for "language_code"',
            },
        },
    },
    source_language_code: {
        type: Sequelize.STRING,
        defaultValue: null,
        validate: {
            notEmpty: {
              msg: 'Please provide a value for "source_language_code"',
            },
        },
    },
  }, { sequelize });

  EQTranslation.associate = (models) => {
    EQTranslation.hasOne(models.EQString, { foreignKey: 'translation_id' });
  };

  return EQTranslation;
};