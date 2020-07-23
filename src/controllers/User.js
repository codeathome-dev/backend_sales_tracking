const { user, sales } = require("../db/models");
const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;
const moment = require("moment");

module.exports = {
  addUser: async (req, res) => {
    try {
      const {
        username,
        nik,
        password,
        role,
        fullname,
        address,
        ttl,
      } = req.body;

      if (role === "sales") {
        const checkUser = await user.findOne({
          where: {
            [Op.or]: [{ nik }, { username }],
          } /* query cek kelas yang berisi E2 || E3 */,
        });

        if (checkUser) {
          return res.send({
            code: 403,
            message: "Username or Email already exists",
          });
        }

        const insertUser = await user.create({
          username,
          nik,
          password,
          role,
          status: "Active",
        });

        await sales.create({
          fullname,
          address,
          ttl,
          status: "Close",
          user_id: insertUser.id,
        });

        res.send({
          code: 201,
          message: true,
        });
      } else {
        res.send({
          code: 201,
          message: "create supervisor",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  getUser: (req, res) => {
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
    sales
      .count()
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
        return sales.findAll({
          include: [
            {
              model: user,
              where: {
                [Op.or]: [
                  {
                    nik: {
                      [Op.like]: `%${q}%`,
                    },
                  },
                  {
                    username: {
                      [Op.like]: `%${q}%`,
                    },
                  },
                ],
              },
            },
          ],
          limit,
          offset,
        });
      })
      .then((data) => {
        const { pages } = pagination;
        let user = [];
        data.forEach((data) => {
          user.push({
            id: data.id,
            fullname: data.fullname,
            address: data.address,
            ttl: moment(data.ttl).format("DD-MM-YYYY, h:mm:ss"),
            nik: data.user ? data.user.nik : "",
            user_id: data.user ? data.user.id : "",
            username: data.user ? data.user.username : "",
            role: data.user ? data.user.role : "",
          });
        });
        res.status(200).json({
          message: "Success Read Users",
          data: {
            user,
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

  deleteUser: async (req, res) => {
    try {
      const { user_id } = req.params;

      const data = await sales.findOne({
        where: { user_id: { [Op.eq]: user_id } },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find users with id: ${user_id}`,
        });
      }

      await data.destroy();

      res.send({
        code: 200,
        message: true,
      });
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },
};
