const express = require('express');
const services = require('../service');

module.exports = () => {
  let router = express.Router();
  router.get('/questionnaires', async (req, res) => {
    try {
      let ret = await services.Questionnaire.getQuestionnaires();
      res.status(200).send({
        code: 200,
        message: 'success',
        data: ret
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.get('/questionnaires/:id', async (req, res) => {
    try {
      let ret = await services.Questionnaire.getQuestionnaireById(req.params.id);
      res.status(200).send({
        code: 200,
        message: 'success',
        data: ret
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
