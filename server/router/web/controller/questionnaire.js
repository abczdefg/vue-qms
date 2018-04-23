const express = require('express');
const services = require('../../../service');
const router = express.Router();

module.exports = () => {
  router.get('/questionnaires', async (req, res) => {
    let ret = await services.Questionnaire.getPublishedQuestionnaires();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: ret
    });
  });
  router.get('/questionnaires/:id', async (req, res) => {
    let ret = await services.Questionnaire.getQuestionnaireById(req.params.id);
    res.status(200).send({
      code: 200,
      message: 'success',
      data: ret
    });
  });
  return router;
};
