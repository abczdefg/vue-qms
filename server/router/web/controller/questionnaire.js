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
      let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      await Service.Questionnaire.submitQuestionnaire({
        ...req.body,
        ip
      });
      res.status(200).send({ code: 200, message: 'success' });
    } catch(e) {
      console.error(e);
      res.status(500).send({ code: 500, message: 'database error' });
    }
  });
  return router;
};
