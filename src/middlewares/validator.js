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

  validateUsers: [
    check("username").notEmpty(),
    check("nik").notEmpty(),
    check("password").notEmpty(),
    check("role").notEmpty(),
    check("address").notEmpty(),
    check("ttl").notEmpty(),
    check("fullname").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],

  validateApotik: [
    check("name").notEmpty(),
    check("lat").notEmpty(),
    check("long").notEmpty(),
    check("address").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],

  validateAddCart: [
    check("product_id").notEmpty(),
    check("qty").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],

  validateAddCheckout: [
    check("sales_id").notEmpty(),
    check("notes").notEmpty(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(422).send({ error: error.array() });
      }
      next();
    },
  ],
};
