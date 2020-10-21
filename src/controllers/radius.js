const { Radius } = require("../db/models");

module.exports = {
    addRadius: async (req, res) => {
        try {
            const { name } = req.body;

            await Radius.create({
                name,
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

    getRadius: async (req, res) => {
        try {
            const data = await Radius.findAll({
                order: [["id", "DESC"]],
            })
            res.send({
                code: 200,
                message: true,
                data
            });
        } catch (error) {
            console.log(error)
            res.send({
                code: 500,
                message: "Internal server error!",
            });
        }
    }
}