const express = require('express');
const Service = require('../service');

module.exports = () => {
  let router = express.Router();
  router.get('/questionnaires', async (req, res) => {
    try {
      let ret = await Service.Questionnaire.getQuestionnaires();
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
      let ret = await Service.Questionnaire.getQuestionnaireById(req.params.id);
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
  router.post('/questionnaires', async (req, res, next) => {
    try {
      await Service.Questionnaire.addQuestionnaire(req.body);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.put('/questionnaires/:id', async (req, res) => {
    try {
      await Service.Questionnaire.updateQuestionnaire(req.body);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.delete('/questionnaires/:id', async (req, res) => {
    try {
      await Service.Questionnaire.deleteQuestionnaireById(req.params.id);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
