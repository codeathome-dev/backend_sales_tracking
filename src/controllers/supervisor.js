const { apotik, trip, sales, user } = require("../db/models");

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
      const { id } = req.params;
      const { sales_id } = req.body;

      const data = await trip.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find sales with id: ${id}`,
        });
      }

      data.sales_id = sales_id;

      await data.save();

      res.send({
        code: 200,
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
};
