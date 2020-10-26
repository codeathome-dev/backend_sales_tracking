const { apotik, trip, sales, user, detailtrip, checkout, order, product } = require("../db/models");

const path = require("path");
const fs = require("fs-extra");

const Op = require("sequelize").Op;

module.exports = {
  getTrip: async (req, res) => {
    try {
      const data = await trip.findAll({
        include: [{ model: apotik }, { model: sales }],
      });

      let trips = [];
      data.forEach((data) => {
        trips.push({
          id: data.id,
          day: data.day,
          //   address: data.address,
          apotik_id: data.apotik ? data.apotik.id : "",
          name_apotik: data.apotik ? data.apotik.name : "",
          lat_apotik: data.apotik ? data.apotik.lat : "",
          long_apotik: data.apotik ? data.apotik.long : "",
          image: data.apotik ? data.apotik.image : "",
          address_apotik: data.apotik ? data.apotik.address : "",
          sales_id: data.sale ? data.sale.id : "",
          fullname: data.sale ? data.sale.fullname : "",
        });
      });
      res.status(200).json({
        message: "Success Read trip",
        data: trips,
      });
    } catch (error) {
      console.log(error);
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

  getSalesOpen: async (req, res) => {
    try {
      const data = await sales.findAll({
        where: { status: "Open" },
        include: [
          {
            model: user,
            where: { role: "sales" },
          },
        ],
      });

      res.status(200).json({
        message: "Success Read Sales",
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

  addSalesToTrip: async (req, res) => {
    try {
      const { trip_id } = req.params;
      const { sales_id } = req.body;

      const data = await detailtrip.create({
        sales_id,
        trip_id,
        status: "Active",
      });

      res.send({
        code: 201,
        status: "OK",
        message: "Success update trip",
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
  getDetailSalesTrip: async (req, res) => {
    try {
      const { trip_id } = req.params;
      const data = await detailtrip.findAll({
        where: {
          [Op.and]: [{ trip_id: trip_id }],
        },
        include: [
          {
            model: trip,
          },
          {
            model: sales,
          },
        ],
      });

      res.status(200).json({
        message: "Success Read Sales",
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

  deleteDetailTrip: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await detailtrip.findOne({
        where: { id: { [Op.eq]: id } },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find detail trip with ${id} `,
        });
      }

      await data.destroy();

      res.send({
        code: 200,
        status: "OK",
        message: "Success deleting detail trip",
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

  getTrackingSalesinApotik: async (req, res) => {
    try {
      const { sales_id } = req.params;
      const checkSales = await sales.findOne({
        where: { id: sales_id },
      });

      const data = await checkout.findAll({
        where: { sales_id },
        include: [
          {
            model: apotik,
          },
          {
            model: sales,
          },
        ],
      });

      res.send({
        code: 200,
        sales: checkSales,
        tracking: data,
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

  getDetailTrackingAndHistory: async (req, res) => {
    try {
      const { checkout_id } = req.params;

      const data = await order.findAll({
        where: { checkout_id },
        include: [
          {
            model: checkout,
            include: [
              {
                model: apotik,
              },
            ],
          },
          {
            model: product,
          },
        ],
      });

      res.send({
        code: 200,
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
};
