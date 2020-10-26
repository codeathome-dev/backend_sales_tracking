const { apotik, trip, sales, user, detailtrip, cart, product, checkout, order } = require("../db/models");
const Op = require("sequelize").Op;

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
        const isPasswordTrue = checkUser.checkPassword(password, checkUser.password);

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
        const isPasswordTrue = checkUser.checkPassword(password, checkUser.password);

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
        where: {
          [Op.and]: [{ status: "Active" }, { sales_id: sales_id }],
        },
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
      const apotikDetailTrip = await detailtrip.findOne({
        where: { id: detailtrip_id },
        include: [{
          model: trip,
          include: [{ model: apotik }],
        }],
      })
      const data = await cart.findAll({
        where: { detailtrip_id: detailtrip_id },
        include: [{ model: detailtrip }, { model: product }],
      });

      res.status(200).json({
        message: "Success Read trip",
        data,
        apotikDetailTrip
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

  addSalestoApotik: async (req, res) => {
    try {
      const { detailtrip_id } = req.params;
      const { notes, sales_id, lat, long } = req.body;
      // if (!req.file) {
      //   return res.send({
      //     code: 404,
      //     message: "Not found, Image",
      //   });
      // }

      const check_apotik = await detailtrip.findOne({
        where: { id: detailtrip_id, sales_id },
        include: [
          {
            model: trip,
            include: [
              {
                model: apotik,
              },
            ],
          },
        ],
      });

      if (!check_apotik) {
        return res.send({
          code: 404,
          message: "Not found, id sales or id detailtrip",
        });
      }

      const check_card_by_sales = await cart.findAll();

      const insert = await checkout.create({
        notes: notes ? notes : "",
        sales_id: sales_id,
        apotik_id: check_apotik.trip.apotik.id,
        status: "Active",
        long: long,
        lat: lat,
        image: req.file ? `images/${req.file.filename}` : "",
        total_harga: 0,
      });

      let total_harga = 0;
      let tampung = 0;
      for (let i = 0; i < check_card_by_sales.length; i++) {
        const insertOrder = await order.create({
          sales_id: sales_id,
          detailtrip_id: detailtrip_id,
          product_id: check_card_by_sales[i].product_id,
          checkout_id: insert.id,
          qty: check_card_by_sales[i].qty,
          price: check_card_by_sales[i].price,
        });

        tampung = check_card_by_sales[i].qty * check_card_by_sales[i].price;

        total_harga += tampung;

        const updateStockProduct = await product.findOne({
          where: { id: insertOrder.product_id },
        });

        updateStockProduct.stock -= insertOrder.qty;
        await updateStockProduct.save();

        const remoteCart = await cart.findOne({
          id: check_card_by_sales[i].id,
        });

        await remoteCart.destroy();
      }

      insert.total_harga = total_harga;
      await insert.save();

      check_apotik.status = "Nonactive";
      check_apotik.save();

      res.send({
        code: 201,
        insert,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  changeStatusSales: async (req, res) => {
    try {
      const { sales_id } = req.params;
      const data = await sales.findOne({
        where: { id: sales_id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find sales with id: ${id}`,
        });
      }
      if (data.status === "Open") {
        data.status = "Close";
      } else {
        data.status = "Open";
      }
      await data.save();

      res.send({
        code: 200,
        message: "Success update status sales",
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
  dashboard: async (req, res) => {
    try {
      const { sales_id } = req.params;
      const total_trip = await detailtrip.findAll({
        where: { sales_id },
      });

      const trip_sucess = await detailtrip.findAll({
        where: {
          [Op.and]: [{ status: "Nonactive" }, { sales_id: sales_id }],
        },
      });

      const orderTotal = await order.findAll({
        where: { sales_id },
      });

      console.log(orderTotal);
      let totalProduct = 0;
      orderTotal.forEach((data) => {
        totalProduct += data.qty;
      });

      res.status(200).json({
        message: true,
        total_trip: total_trip.length,
        trip_success: trip_sucess.length,
        total_product: totalProduct,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
