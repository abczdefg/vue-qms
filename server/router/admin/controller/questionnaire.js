const express = require('express');
const services = require('../service');
let { hasPrivilege } = services.Rbac;

module.exports = () => {
  let router = express.Router();
  router.get('/questionnaires', hasPrivilege('questionnaire'));
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
  router.post('/questionnaires', async (req, res, next) => {
    try {
      await services.Questionnaire.addQuestionnaire(req.body);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.put('/questionnaires/:id', async (req, res) => {
    try {
      await services.Questionnaire.updateQuestionnaire(req.body);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.delete('/questionnaires/:id', async (req, res) => {
    try {
      await services.Questionnaire.deleteQuestionnaireById(req.params.id);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.put('/questionnaires/:id/publish', async (req, res) => {
    try {
      await services.Questionnaire.publishQuestionnaire(req.body);
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  router.get('/questionnaires/:id/results', async (req, res) => {
    try {
      let results = await services.Result.getResultsByQuestionnaireId(req.params.id);
      res.status(200).send({
        code: 200,
        message: 'success',
        data: results
      });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
