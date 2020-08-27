const { apotik, trip, sales, user, detailtrip, checkout, order, product } = require("../db/models");

module.exports = {
  dashboard: async (req, res) => {
    try {
      let totalStockProduct = 0;
      const totalProduct = await product.findAll();
      //   totalProduct.forEach((data) => {
      //     totalStockProduct += data.stock;
      //   });

      const orderTotal = await order.findAll();

      //   let totalProductTerjual = 0;
      //   orderTotal.forEach((data) => {
      //     totalProductTerjual += data.qty;
      //   });

      const totalSales = await sales.findAll({
        include: [{ model: user, where: { role: "sales" } }],
      });

      const total_trip = await detailtrip.findAll();

      const trip_to_sales_done = await checkout.findAll({
        include: [
          {
            model: sales,
            include: [
              {
                model: user,
              },
            ],
          },
          {
            model: apotik,
          },
        ],
      });

      res.send({
        message: true,
        totalProduct: totalProduct.length,
        totalProductBuy: orderTotal.length,
        totalSales: totalSales.length,
        totalTrip: total_trip.length,
        trip_to_sales_done,
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
