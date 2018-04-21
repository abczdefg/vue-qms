const express = require('express');
const services = require('../../../service');
let { hasPrivilege } = services.Rbac;

module.exports = () => {
  let router = express.Router();
  router.all('/questionnaires/*', hasPrivilege('questionnaire'));
  router.get('/questionnaires', async (req, res) => {
    let ret = await services.Questionnaire.getQuestionnaires();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: ret
    });
  });
  router.get('/questionnaires/count', async (req, res) => {
    let total = await services.Questionnaire.getQuestionnairesCount();
    res.status(200).send({
      code: 200,
      message: 'success',
      data: {
        total
      }
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
  router.post('/questionnaires', async (req, res, next) => {
    await services.Questionnaire.addQuestionnaire(req.body);
    res.status(200).send({ code: 200, message: 'success' });
  });
  router.put('/questionnaires/:id', async (req, res) => {
    await services.Questionnaire.updateQuestionnaire(req.body);
    res.status(200).send({ code: 200, message: 'success' });
  });
  router.delete('/questionnaires/:id', async (req, res) => {
    await services.Questionnaire.deleteQuestionnaireById(req.params.id);
    res.status(200).send({ code: 200, message: 'success' });
  });
  router.put('/questionnaires/:id/publish', async (req, res) => {
    await services.Questionnaire.publishQuestionnaire(req.body);
    res.status(200).send({ code: 200, message: 'success' });
  });
  router.get('/questionnaires/:id/results', async (req, res) => {
    let results = await services.Result.getResultsByQuestionnaireId(req.params.id);
    res.status(200).send({
      code: 200,
      message: 'success',
      data: results
    });
  });
  return router;
};
