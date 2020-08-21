const {
  apotik,
  trip,
  sales,
  user,
  detailtrip,
  checkout,
  order,
  product,
} = require("../db/models");
const moment = require("moment");

module.exports = {
  getAllOrder: async (req, res) => {
    try {
      const data = await checkout.findAll({
        order: [["id", "DESC"]],
        include: [{ model: order }, { model: sales }, { model: apotik }],
      });

      let array = [];

      data.forEach((data) => {
        array.push({
          id: data.id,
          tanggal: moment(data.createdAt).format("DD-MM-YYYY, h:mm:ss"),
          nama_sales: data.sale ? data.sale.fullname : "",
          address_apotik: data.apotik ? data.apotik.address : "",
          total_harga: data.total_harga,
          status: data.status,
        });
      });
      res.send({
        code: 200,
        data: array,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  getDetailOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const checkCheckout = await checkout.findOne({
        where: { id },
        include: [
          {
            model: sales,
          },
          {
            model: apotik,
          },
        ],
      });
      const data = await order.findAll({
        where: { checkout_id: id },
        include: [
          {
            model: checkout,
          },
          {
            model: product,
          },
        ],
      });
      res.send({
        code: 200,
        checkout: checkCheckout,
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
};
