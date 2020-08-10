const { product } = require("../db/models");
const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;

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
        image: `images/${req.file.filename}`,
      });

      res.send({
        code: 201,
        data: insert,
      });
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error!",
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
        console.log(err);
        res.status(500).json({
          message: "Something Went Wrong",
        });
      });
  },

  getSingleProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await product.findOne({
        where: { id },
      });

      if (!data)
        return res.send({
          code: 404,
          message: "Not found, product",
        });
      res.send({
        code: 200,
        status: "Ok",
        message: "Success read single  product",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: error,
      });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, tgl_ex, price, stock } = req.body;

      const data = await product.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find product with id: ${id}`,
        });
      }

      if (req.file === undefined) {
        data.name = name;
        data.tgl_ex = tgl_ex;
        data.price = price;
        data.stock = stock;

        await data.save();
      } else {
        await fs.unlink(path.join(`uploads/${data.image}`));
        data.name = name;
        data.tgl_ex = tgl_ex;
        data.price = price;
        data.stock = stock;
        data.image = `images/${req.file.filename}`;
        await data.save();
      }
      res.send({
        code: 200,
        status: "OK",
        message: "Success update product",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: true,
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await product.findOne({
        where: { id: { [Op.eq]: id } },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find product with id: ${id}`,
        });
      }
      await fs.unlink(path.join(`uploads/${data.image}`));
      await data.destroy();

      res.send({
        code: 200,
        status: "OK",
        message: "Success deleting product",
        data: data,
      });
    } catch (error) {
      const { id } = req.params;

      const data = await product.findOne({
        where: { id: { [Op.eq]: id } },
      });

      await data.destroy();

      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: true,
      });
    }
  },
};
