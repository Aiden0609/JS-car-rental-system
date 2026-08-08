const express = require('express');
const { Car } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');
const { NotFound, Conflict } = require('http-errors');
const { success, failure } = require('../utils/responses');

/* GET cars listing.
 * GET '/cars' */
router.get('/', async function (req, res, next) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      where: {},
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
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
    success(res, 'Cars retrieved successfully', {
      cars: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

/* GET '/cars/:id' */
router.get('/:id', async function (req, res, next) {
  try {
    const car = await getCar(req);

    success(res, 'Car retrieved successfully', { car });
  } catch (error) {
    failure(res, error);
  }
});

/* POST '/cars'
 * Record a new car */
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req);

    const carData = {
      brand: body.brand,
      licensePlate: body.licensePlate,
      dailyRate: body.dailyRate,
    };
    if (body.status) carData.status = body.status;

    const car = await Car.create(carData);
    success(res, 'Car created successfully', { car });
  } catch (error) {
    failure(res, error);
  }
});

/* PUT '/cars/:id'
 * Update a car */
router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req);

    const carData = {
      brand: body.brand,
      licensePlate: body.licensePlate,
      dailyRate: body.dailyRate,
    };
    if (body.status) carData.status = body.status;

    const car = await getCar(req);
    await car.update(carData);

    success(res, 'Car updated successfully', { car });
  } catch (error) {
    failure(res, error);
  }
});

/* DELETE '/cars/:id'
 * Delete a car */
router.delete('/:id', async function (req, res, next) {
  try {
    const car = await getCar(req);
    if (car.status === 'RENTED') {
      throw new Conflict('Car currently in use');
    }
    await car.destroy();

    success(res, 'Car deleted successfully');
  } catch (error) {
    failure(res, error);
  }
});

/* Find a car by its id from the request params, throw NotFound if it does not exist */
async function getCar(req) {
  const { id } = req.params;
  const car = await Car.findByPk(id);
  if (!car) {
    throw new NotFound(`Car with id ${id} not found`);
  }
  return car;
}

/* Public function
 * Filter the body of the request
 * */
function filterBody(req) {
  return {
    licensePlate: req.body.licensePlate,
    brand: req.body.brand,
    dailyRate: req.body.dailyRate,
    status: req.body.status,
  };
}

module.exports = router;
