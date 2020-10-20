const { user, sales } = require("../db/models");
const path = require("path");
const fs = require("fs-extra");
const Op = require("sequelize").Op;
const moment = require("moment");
const bcrypt = require("bcryptjs");

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

      if (!req.file) {
        return res.send({
          code: 404,
          message: "Not found, Image",
        });
      }

      const checkUser = await user.findOne({
        where: {
          [Op.or]: [{ nik }, { username }],
        }
      });

      if (checkUser) {
        return res.send({
          code: 403,
          message: "Username or Nik already exists",
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
        image: `images/${req.file.filename}`,
      });

      res.send({
        code: 201,
        message: true,
      });

      res.send({
        code: 201,
        message: "create supervisor",
      });
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
            status: data.status,
            ttl: moment(data.ttl).format("DD-MM-YYYY"),
            nik: data.user ? data.user.nik : "",
            user_id: data.user ? data.user.id : "",
            username: data.user ? data.user.username : "",
            role: data.user ? data.user.role : "",
            image: data.image,
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

  getSingleUser: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await sales.findOne({
        where: { id },
        include: [{ model: user }],
      });

      if (!data)
        return res.send({
          code: 404,
          message: "Not found, users",
        });

      res.send({
        code: 200,
        status: "Ok",
        message: "Success read single  users",
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
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      let {
        username,
        nik,
        password,
        role,
        fullname,
        address,
        ttl,
        user_id,
      } = req.body;

      const data = await sales.findOne({
        where: { id },
      });

      const users = await user.findOne({
        where: { id: user_id },
      });

      console.log("password")
      console.log(password)

      if (!data) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find sales with id: ${id}`,
        });
      }

      if (!users) {
        return res.send({
          code: 404,
          message: `Not Found, Can't find users with id: ${id}`,
        });
      }
      if (req.file === undefined) {
        data.fullname = fullname;
        data.address = address;
        data.ttl = ttl;
        await data.save();
      } else {
        await fs.unlink(path.join(`uploads/${data.image}`));
        data.fullname = fullname;
        data.address = address;
        data.ttl = ttl;
        data.image = `images/${req.file.filename}`;
        await data.save();
      }
      const isPasswordTrue = users.checkPassword(
        password,
        users.password
      );

      if (isPasswordTrue) {
        users.username = username;
        users.nik = nik;
        users.role = role;
        await users.save();
      } else {
        const salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        users.username = username;
        users.nik = nik;
        users.password = password;
        users.role = role;
        await users.save();

      }

      res.send({
        code: 200,
        status: "OK",
        message: "Success update users",
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
