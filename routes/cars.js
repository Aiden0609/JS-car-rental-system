const express = require('express');
const { Car } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');

/* GET cars listing.
* GET '/cars' */
router.get('/', async function(req, res, next) {
  try {
      const query = req.query;
      const currentPage = Math.abs(Number(query.currentPage)) || 1;
      const pageSize = Math.abs(Number(query.pageSize)) || 10;
      const offset = (currentPage - 1) * pageSize;

      const condition = {
          where: {},
          order: [['id', 'DESC']],
          limit: pageSize,
          offset: offset
      };
      if (query.status) {
          condition.where.status = query.status;
      }
      if (query.dailyRateMin || query.dailyRateMax) {
          const rateCondition = {};
          if (query.dailyRateMin) {
              rateCondition[Op.gte] = parseFloat(query.dailyRateMin);
          }
          if (query.dailyRateMax) {
              rateCondition[Op.lte] = parseFloat(query.dailyRateMax);
          }
          condition.where.dailyRate = rateCondition;
      }
      if (query.brand) {
          condition.where.brand = {
              [Op.like]: `%${query.brand}%`,
          };
      }
      if (query.licensePlate) {
          condition.where.licensePlate = {
              [Op.like]: `%${query.licensePlate}%`,
          };
      }

      const { count, rows } = await Car.findAndCountAll(condition);
      res.json({
          status: true,
          message: 'Cars retrieved successfully',
          data: {
              cars: rows,
              pagination: {
                  total: count,
                  currentPage,
                  pageSize
              },
          }
      });
  } catch (error) {
      res.status(500).json({
          status: false,
          message: `Error retrieving cars`,
          errors: [error.message]
      });
  }
});

/* Public function
 * Filter the body of the request
* */
function filterBody(req) {
    return {
        licensePlate: req.body.licensePlate,
        brand: req.body.brand,
        dailyRate: req.body.dailyRate,
        status: req.body.status,
    }
}

module.exports = router;
