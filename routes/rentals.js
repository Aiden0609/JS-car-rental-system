const express = require('express');
const { Car, Customer, Rental, sequelize } = require('../models');
const router = express.Router();
const { NotFound, Conflict } = require('http-errors');
const { success, failure } = require('../utils/responses');
const Decimal = require('decimal.js');

/* GET rentals listing.
 * GET '/rentals'
 * Support filter by status (ONGOING / COMPLETED) or customer */
router.get('/', async function (req, res, next) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      ...getCondition(),
      where: {},
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset,
    };
    if (query.status) {
      condition.where.status = query.status;
    }
    if (query.customerId) {
      condition.where.customerId = query.customerId;
    }

    const { count, rows } = await Rental.findAndCountAll(condition);
    success(res, 'Rentals retrieved successfully', {
      rentals: rows,
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

/* GET '/rentals/:id' */
router.get('/:id', async function (req, res, next) {
  try {
    const rental = await getRental(req);

    success(res, 'Rental retrieved successfully', { rental });
  } catch (error) {
    failure(res, error);
  }
});

/* POST '/rentals'
 * Start a new rental */
router.post('/', async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    const body = filterBody(req);

    const car = await Car.findByPk(body.carId, { transaction: t });
    // if (!car) {
    //   throw new NotFound(`Car with id: ${body.carId} not found`);
    // }

    if (car.status !== 'AVAILABLE') {
      throw new Conflict('Car is unavailable');
    }

    const rental = await Rental.create(body, { transaction: t });
    await car.update({ status: 'RENTED' }, { transaction: t });

    success(res, 'Rental created successfully', { rental });
    await t.commit();
  } catch (error) {
    await t.rollback();
    failure(res, error);
  }
});

/* POST '/rentals/:id/return'
 * Return a rented car */
router.post('/:id/return', async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    const body = filterBody(req);
    const actualReturnDate = body.actualReturnDate ? new Date(body.actualReturnDate) : new Date();

    const rental = await getRental(req);
    if (rental.status !== 'ONGOING') {
      throw new Conflict('Rental is not ongoing');
    }
    const startDate = new Date(rental.createdAt);
    if (startDate > actualReturnDate) {
      throw new Conflict('Start date is later than actual return date');
    }

    const car = await Car.findByPk(rental.carId, { transaction: t });

    const days = getDaysDiff(startDate, actualReturnDate);
    // console.log(days);
    const totalCost = new Decimal(car.dailyRate).times(days);

    await rental.update(
      {
        actualReturnDate,
        totalCost,
        status: 'COMPLETED',
      },
      { transaction: t },
    );

    await car.update({ status: 'AVAILABLE' }, { transaction: t });

    success(res, 'Rental returned successfully', { rental });
    await t.commit();
  } catch (error) {
    await t.rollback();
    failure(res, error);
  }
});

/* PUT '/rentals/:id'
 * Update a rental */
router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req);

    const rental = await getRental(req);
    await rental.update(body);

    success(res, 'Rental updated successfully', { rental });
  } catch (error) {
    failure(res, error);
  }
});

/* DELETE '/rentals/:id'
 * Delete a rental */
router.delete('/:id', async function (req, res, next) {
  try {
    const rental = await getRental(req);
    if (rental.status === 'ONGOING') {
      throw new Conflict('Rental currently in progress');
    }
    await rental.destroy();

    success(res, 'Rental deleted successfully');
  } catch (error) {
    failure(res, error);
  }
});

/* Find a rental by its id (with car & customer associations), throw NotFound if it does not exist */
async function getRental(req) {
  const { id } = req.params;
  const condition = getCondition();
  const rental = await Rental.findByPk(id, condition);
  if (!rental) {
    throw new NotFound(`Rental with id ${id} not found`);
  }
  return rental;
}

/* Shared query condition: exclude raw FK columns, include car & customer associations */
function getCondition() {
  return {
    attributes: { exclude: ['CarId', 'CustomerId'] },
    include: [
      {
        model: Car,
        as: 'car',
        attributes: ['id', 'brand', 'licensePlate'],
      },
      {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'phone'],
      },
    ],
  };
}

/* Calculate the number of days between two dates (rounded up), used for cost settlement */
function getDaysDiff(d1, d2) {
  const d1Dec = new Decimal(d1.getTime().toString());
  const d2Dec = new Decimal(d2.getTime().toString());

  // 计算毫秒差值（绝对值）
  const diffInMs = d2Dec.minus(d1Dec).abs();

  // 转换为天数（一天的毫秒数是 1000 * 60 * 60 * 24 = 86400000）
  const dayMs = new Decimal('1000').times('60').times('60').times('24');
  const diffInDays = Decimal.div(diffInMs, dayMs);

  return diffInDays.ceil(); // 向下取整获取完整天数
}

/* Public function
 * Filter the body of the request
 * */
function filterBody(req) {
  return {
    carId: req.body.carId,
    customerId: req.body.customerId,
    expectedReturnDate: req.body.expectedReturnDate,
    actualReturnDate: req.body.actualReturnDate,
    status: req.body.status,
  };
}

module.exports = router;
