const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize, models } = require('./db');
const { EQString, EQTranslation } = models;
const Op = sequelize.Op;
const cors = require('cors');

(async () => {
  await sequelize.sync({ force: true }); // NOTE: Remove { force: true } when redy for launch
  try {

    // First translation added
    const firstString = await EQString.create({
      word: 'Häst',
      description: 'Ett djur som används till ridning',
      language_code: 'sv-SE',
    });

    const secondString = EQString.create({
      word: 'Horse',
      description: 'An animal used for riding.',
      language_code: 'en-GB',
    });

    const firstTranslation = await EQTranslation.create({
      string_id: 1,
      group_id: 1,
      language_code: 'sv-SE',
    });

    const secondTranslation = await EQTranslation.create({
      string_id: 2,
      group_id: 1,
      language_code: 'en-GB',
      source_language_code: 'sv-SE',
    });

    const firstLangString = await EQString.findByPk(firstTranslation.id);
    const secondLangString = await EQString.findByPk(secondTranslation.id);

    await firstLangString.update({
      translation_id: firstTranslation.id
    });
    await secondLangString.update({
      translation_id: secondTranslation.id,
    });

    // Second translation added
    const thirdString = await EQString.create({
      word: 'Föl',
      description: 'En hästbebis',
      language_code: 'sv-SE',
    });

    const fourthString = EQString.create({
      word: 'Foal',
      description: 'A baby horse',
      language_code: 'en-GB',
    });

    const thirdTranslation = await EQTranslation.create({
      string_id: 3,
      group_id: 2,
      language_code: 'sv-SE',
    });

    const fourthTranslation = await EQTranslation.create({
      string_id: 4,
      group_id: 2,
      language_code: 'en-GB',
      source_language_code: 'sv-SE',
    });

    const thirdLangString = await EQString.findByPk(thirdTranslation.id);
    const fourthLangString = await EQString.findByPk(fourthTranslation.id);

    await thirdLangString.update({
      translation_id: thirdTranslation.id
    });
    await fourthLangString.update({
      translation_id: fourthTranslation.id,
    });

  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/translations');

const app = express();

// allow CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/translations', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
