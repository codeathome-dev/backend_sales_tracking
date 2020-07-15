const { product } = require("../db/models");
const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;

const url = "http://localhost:8000/";

module.exports = {
  addProduct: async (req, res) => {
    try {
      const { name, tgl_ex, price, stock } = req.body;

      if (!req.file) {
        return res.send({
          code: 404,
          message: "Not found, Image",
        });
      }

      const insert = await product.create({
        name,
        price,
        stock,
        tgl_ex,
        image: `${url}images/${req.file.filename}`,
      });

      res.send({
        code: 201,
        status: "Ok",
        message: "Success add new  product",
        data: insert,
      });
    } catch (error) {
      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: error,
      });
    }
  },

  getProduct: (req, res) => {
    let { q, page } = req.query;
    if (!q) {
      q = "";
    }
    if (!page) {
      page = 1;
    }
    let pagination;
    let limit = 10;
    let offset = 0;
    product
      .count({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${q}%`,
              },
            },
          ],
        },
      })
      .then((count) => {
        let pages = Math.ceil(count / limit);
        offset = limit * (page - 1);
        pagination = {
          limit,
          offset,
          pages,
          page,
        };
        return pagination;
      })
      .then((pagination) => {
        const { limit, offset } = pagination;
        return product.findAll({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${q}%`,
                },
              },
            ],
          },
          limit,
          offset,
        });
      })
      .then((data) => {
        const { pages } = pagination;
        res.status(200).json({
          message: "Success Read Product",
          data: {
            data,
            pages,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something Went Wrong",
        });
      });
  },
};
