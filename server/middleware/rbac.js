module.exports.checkPrivilege = (resource) => {
  return (req, res, next) => {
    if(req.session.privilege && req.session.privilege.includes(resource)) {
      next();
    } else {
      res.status(403).send({ code: 403, message: 'Forbidden' });
    }
  };
};
