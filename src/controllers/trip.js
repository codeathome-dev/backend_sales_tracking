const { apotik, trip, sales } = require("../db/models");

const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;

module.exports = {
  addTrip: async (req, res) => {
    try {
      const { apotik_id, sales_id, day } = req.body;

      await trip.create({
        apotik_id,
        sales_id,
        day,
        status: "Active",
      });

      res.send({
        code: 201,
        message: true,
      });
    } catch (error) {
      res.send({
        code: 500,
        message: "Internal server error!",
      });
    }
  },

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
          address: data.address,
          apotik_id: data.apotik ? data.apotik.id : "",
          name_apotik: data.apotik ? data.apotik.name : "",
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
};
