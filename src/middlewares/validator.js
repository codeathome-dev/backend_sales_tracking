const { check, validationResult } = require("express-validator");

module.exports = {
  validateProduct: [
    check("name").notEmpty(),
    check("tgl_ex").notEmpty(),
    check("price").notEmpty(),
    check("stock").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
};
