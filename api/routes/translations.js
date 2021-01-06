const express = require('express');
const router = express.Router();
const { sequelize, Sequelize, models } = require('./../db');
const Op = Sequelize.Op;
const { EQString, EQTranslation } = models;
const asyncHandler = require('./../middleware/asyncHandler');

// Send a GET request to '/' to READ(view) all translations
// 200 - Returns a list of translations
router.get('/', asyncHandler(async function(req, res, next) {

  // Get all null
  const translations = await EQTranslation.findAll({
    where: {
      source_language_code: null,
    },
    include: {
      model: EQString,
      attributes: [ 'id', 'language_code', 'word', 'description' ],
    },
  });
  // let count = 0;
  // const words = [];
  // groups.map(async group => {
  //   words[count] = {
  //     id: group.dataValues.id,
  //     // group_id: group.group_id,
  //     name: group.dataValues.word,
  //     description: group.dataValues.description,
  //     language_code: group.dataValues.language_code,
  //     translations: [],
  //   }
  //   const associatedTranslations = await EQTranslation.findAll({
  //     where: {
  //       source_language_code: {
  //         [Op.ne]: null,
  //       },
  //       group_id: group.group_id,
  //     },
  //     include: {
  //       model: EQString,
  //       attributes: [ 'id', 'language_code', 'word', 'description' ],
  //     },
  //   });
  //   associatedTranslations.map(translation => {
  //     const whatever = {
  //       id: group.dataValues.id,
  //       name: group.dataValues.word,
  //       description: group.dataValues.description,
  //       language_code: group.dataValues.language_code,
  //     }
  //     words[count].translations.push(whatever);
  //   });
  //   count++;
  // });

  // loop through all the groups to get all the related string ids
  // const groupedIds = groups.map( async group => {
  //   return await EQTranslation.findAll({
  //     attributes: ['string_id'],
  //     where: {
  //       group_id: group.group_id
  //     }
  //   });
  // });
  // get all string_ids related to that group the group
  // left join EQStrings where id equals string_id

  // const translations = await EQTranslation.findAll({
  //   // attributes: ['id', 'group_id'],
  //   include: {
  //     model: EQString,
  //     // attributes: [ 'id', 'language_code', 'word', 'description' ],
  //   },
  //   // include: {
  //   //   model: EQString,
  //   //   where: {
  //   //     group: 'string_id'
  //   //   },
  //   //   attributes: [ 'language_code', 'word', 'description' ],
  //   // },
  //   group: 'group_id'
  // });



  res.status(200).json({translations: translations});
}));

// Send a GET request to '/:id' to READ(view) one translation by ID
// 200 - Returns a the translation for the provided course ID
router.get('/:id', asyncHandler( async function(req, res, next) {

  // Find the record by id
  const firstLangString = await EQString.findByPk(req.params.id);

  // Find out group_id
  const translationGroup = await EQTranslation.findOne({
    where: {
      string_id: req.params.id
    },
  });

  // Find translation that belongs to the same group
  const relatedTranslation = await EQTranslation.findOne({
    where: {
      group_id: translationGroup.group_id,
      string_id: {
        [Op.not]: firstLangString.id
      }
    },
  });

  // Find String that belongs to the same group
  const secondLangString = await EQString.findOne({
    where: {
      id: relatedTranslation.string_id,
    }
  });

  // Return translation in both languages
  if(firstLangString && secondLangString) {
    res.status(200).json({
      firstLang: firstLangString,
      secondLang: secondLangString
    });
  } else {
    res.status(404).json({message: 'Translation not found'});
  }

}));

// Send a POST request to CREATE a new translation
// 201 - Creates a translation, 
// sets the Location header to the URI for all translations, 
// and returns no content
router.post('/', asyncHandler(async function(req, res, next) {
  try {
    // Set group ID
    const group = await EQTranslation.findAll({
      attributes: [ 'group_id' , [sequelize.fn('MAX', sequelize.col('group_id')), 'no_groups'] ]
    });
    const noGroups = group[0].dataValues.no_groups;
    let groupId;
    // If groups exists increase by one, else set group number to one
    noGroups !== null ? groupId = noGroups + 1 : groupId = 1;

    // Save first word to string table
    const stringInstanceFL = await EQString.create({
      word: req.body.firstLangWord,
      description: req.body.firstLangDesc,
      language_code: req.body.firstLangCode,
    });

    // Save first word to translations table
    const translationInstanceFL = await EQTranslation.create({
      string_id: stringInstanceFL.id,
      group_id: groupId,
      language_code: stringInstanceFL.language_code,
    });

    // Update first word in string table with translation id from translation table
    const firstLangString = await EQString.findByPk(stringInstanceFL.id);
    firstLangString.update({
      translation_id: translationInstanceFL.id,
    });

    // Save second word to string table
    const stringInstanceSL = await EQString.create({
      word: req.body.secondLangWord,
      description: req.body.secondLangDesc,
      language_code: req.body.secondLangCode,
    });

    // Save second word to translations table
    const translationInstanceSL = await EQTranslation.create({
      string_id: stringInstanceSL.id,
      group_id: groupId,
      language_code: stringInstanceSL.language_code,
      source_language_code: stringInstanceFL.language_code,
    });

    // Update second word in string table with translation id from translation table
    const secondLangString = await EQString.findByPk(stringInstanceSL.id);
    secondLangString.update({
      translation_id: translationInstanceSL.id,
    });

    // Redirect to all translations
    res.status(201).end();
    // res.redirect('/translations');
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.message });;
    }
    console.log(error);
    // next(error);
  }

}));

// Send a PUT request to '/:id' to UPDATE(edit) a translation
// 204 - Updates a translation 
// and returns no content
router.put('/:id', asyncHandler( async function(req, res, next) {
  try {
    // Find the records by id
    const firstLangString = await EQString.findByPk(req.params.id);
    const secondLangString = await EQString.findByPk(req.body.secondLangId);

    // Make sure the words have values
    if(!req.body.firstLangWord || !req.body.secondLangWord) {
      res.status(400).json({ message: 'Validation error. Words are required to be able to update this translation.'});
    }

    // Update first String
    firstLangString.word = req.body.firstLangWord;

    if(req.body.firstLangDescription) {
      firstLangString.description = req.body.firstLangDescription;
    } 

    await firstLangString.update({
      word: firstLangString.word,
      description: firstLangString.description,
    });

    // Update second String
    secondLangString.word = req.body.secondLangWord;

    if(req.body.secondLangDescription) {
      secondLangString.description = req.body.secondLangDescription;
    } 

    await secondLangString.update({
      word: secondLangString.word,
      description: secondLangString.description,
    });

    // res.json({task: "UPDATE(edit) a translation from/to db"});
    // res.status(201).redirect('/translations/' + req.params.id);
    res.status(204).end();

  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.message });;
    }
    res.status(500).json({ message: error.message });
  }
  
}));

// Send a DELETE request to '/:id' to DELETE a translation
// 204 - Deletes a translation 
// and returns no content
router.delete('/:id', asyncHandler( async function(req, res, next) {
  
  // Find the record
  const firstLangString = await EQString.findByPk(req.params.id);

  // Find out group_id
  const translationGroup = await EQTranslation.findOne({
    where: {
      string_id: req.params.id
    },
  });

  // Find translation that belongs to the same group
  const relatedTranslation = await EQTranslation.findOne({
    where: {
      group_id: translationGroup.group_id,
      string_id: {
        [Op.not]: firstLangString.id
      }
    },
  });

  // Find String that belongs to the same group
  const secondLangString = await EQString.findOne({
    where: {
      id: relatedTranslation.string_id,
    }
  });
  const firstLangTranslation = await EQTranslation.findByPk(firstLangString.translation_id);
  const secondLangTranslation = await EQTranslation.findByPk(secondLangString.translation_id);

  // Delete a record
  await firstLangString.destroy();
  await secondLangString.destroy();
  await firstLangTranslation.destroy();
  await secondLangTranslation.destroy();

  // Redirect to all translations
  res.status(204).end();
}));
module.exports = router;
