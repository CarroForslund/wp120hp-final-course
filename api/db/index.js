'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const options = {
  dialect: 'sqlite',
  storage: './db/translations.db',
  // global options
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  // logging: false, // disable SQL logging in the console
};

const sequelize = new Sequelize(options);

const models = {};

// Import all of the models.
fs
  .readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    models[modelName].associate(models);
  }
});

const db = {
  sequelize,
  Sequelize,
  models,
};

// db.models.EQString = require('./models/eqStrings.js')(sequelize);
// db.models.EQTranslation = require('./models/eqTranslations.js')(sequelize);

module.exports = db;