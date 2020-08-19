const {
  apotik,
  trip,
  sales,
  user,
  detailtrip,
  cart,
  product,
} = require("../db/models");

module.exports = {
  signin: async (req, res) => {
    const { nik, password } = req.body;
    try {
      const checkUser = await user.findOne({
        where: {
          nik,
        },
        include: [{ model: sales }],
      });

      if (!checkUser) {
        res.send({
          code: 404,
          message: `Not found, Can't find user with nik: ${nik}`,
        });
      }

      if (checkUser.role === "sales") {
        const isPasswordTrue = checkUser.checkPassword(
          password,
          checkUser.password
        );

        if (!isPasswordTrue) {
          res.send({
            code: 403,
            message: "Forbidden, Your password is invalid!",
          });
        }

        delete checkUser.dataValues.password;

        const token = checkUser.generateAuthToken(user);

        res.send({
          code: 200,
          data: { checkUser, token },
        });
      } else if (checkUser.role === "supervisor") {
        const isPasswordTrue = checkUser.checkPassword(
          password,
          checkUser.password
        );

        if (!isPasswordTrue) {
          res.send({
            code: 403,
            message: "Forbidden, Your password is invalid!",
          });
        }

        delete checkUser.dataValues.password;

        const token = checkUser.generateAuthToken(user);

        res.send({
          code: 200,
          data: { checkUser, token },
        });
      } else {
        res.send({
          code: 403,
          message: "Forbidden, Your role is invalid!",
        });
      }
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error",
      });
    }
  },

  getTripSingleSales: async (req, res) => {
    try {
      const { sales_id } = req.params;
      const data = await detailtrip.findAll({
        where: { sales_id: sales_id },
        include: [
          {
            model: trip,
            include: [{ model: apotik }],
          },
          { model: sales },
        ],
      });

      res.status(200).json({
        message: "Success Read trip",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  addCartSales: async (req, res) => {
    try {
      const { detailtrip_id } = req.params;
      const { product_id, qty } = req.body;

      const check_product = await product.findOne({
        where: { id: product_id },
      });

      if (!check_product) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find product with id: ${id}`,
        });
      }

      if (qty > check_product.stock) {
        return res.send({
          code: 403,
          message: `QTY Melebihi jumlah stock`,
        });
      }
      const data = await cart.create({
        product_id,
        detailtrip_id,
        qty,
        price: check_product.price,
      });

      res.send({
        code: 201,
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  getCartSales: async (req, res) => {
    try {
      const { detailtrip_id } = req.params;
      const data = await cart.findAll({
        where: { detailtrip_id: detailtrip_id },
        include: [{ model: detailtrip }, { model: product }],
      });

      res.status(200).json({
        message: "Success Read trip",
        data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  deleteCartSales: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await cart.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find cart with id: ${user_id}`,
        });
      }

      await data.destroy();

      res.send({
        code: 200,
        message: true,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },
};
