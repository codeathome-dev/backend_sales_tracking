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

  getSingleTrip: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await trip.findOne({
        where: { id },
        include: [{ model: apotik }, { model: sales }],
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find trip with id: ${id}`,
        });
      }

      res.status(200).json({
        message: "Success Read Single Trip",
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

  updateTrip: async (req, res) => {
    try {
      const { id } = req.params;
      const { apotik_id, sales_id, day } = req.body;

      const data = await trip.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find sales with id: ${id}`,
        });
      }

      data.apotik_id = apotik_id;
      data.sales_id = sales_id;
      data.day = day;
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

  deleteTrip: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await trip.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find trip with id: ${user_id}`,
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
