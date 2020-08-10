const { apotik } = require("../db/models");
const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;

module.exports = {
  addApotik: async (req, res) => {
    try {
      const { name, address, long, lat } = req.body;

      if (!req.file) {
        return res.send({
          code: 404,
          message: "Not found, Image",
        });
      }

      await apotik.create({
        name,
        address,
        long,
        lat,
        status: "Active",
        image: `images/${req.file.filename}`,
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

  getApotik: (req, res) => {
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
    apotik
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
        return apotik.findAll({
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
          message: "Success Read apotik",
          data: {
            data,
            pages,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something Went Wrong",
        });
      });
  },

  getSingleApotik: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await apotik.findOne({
        where: { id },
      });

      if (!data)
        return res.send({
          code: 404,
          message: "Not found, apotik",
        });
      res.send({
        code: 200,
        status: "Ok",
        message: "Success read single  apotik",
        data: data,
      });
    } catch (error) {
      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: error,
      });
    }
  },
  updateApotik: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, long, lat } = req.body;

      const data = await apotik.findOne({
        where: { id },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find apotik with id: ${id}`,
        });
      }

      if (req.file === undefined) {
        data.name = name;
        data.address = address;
        data.lat = lat;
        data.long = long;

        await data.save();
      } else {
        await fs.unlink(path.join(`uploads/${data.image}`));
        data.name = name;
        data.address = address;
        data.lat = lat;
        data.long = long;

        data.image = `images/${req.file.filename}`;

        await data.save();
      }

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

  deleteApotik: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await apotik.findOne({
        where: { id: { [Op.eq]: id } },
      });

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find apotik with id: ${id}`,
        });
      }
      await data.destroy();

      res.send({
        code: 200,
        message: "Success deleting apotik",
      });
    } catch (error) {
      res.send({
        code: 500,
        status: "Internal server error!",
        message: "An error occured in server!",
        errors: true,
      });
    }
  },
};
