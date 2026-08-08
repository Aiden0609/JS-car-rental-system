const express = require('express');
const { Customer } = require('../models');
const router = express.Router();
const { Op } = require('sequelize');
const { NotFound, Conflict } = require('http-errors');
const { success, failure } = require('../utils/responses');

/* GET customers listing.
 * GET '/customers' */
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

    if (query.name) {
      condition.where.name = {
        [Op.like]: `%${query.name}%`,
      };
    }
    if (query.phone) {
      condition.where.phone = {
        [Op.like]: `%${query.phone}%`,
      };
    }
    if (query.driversLicense) {
      condition.where.driversLicense = {
        [Op.like]: `%${query.driversLicense}%`,
      };
    }

    const { count, rows } = await Customer.findAndCountAll(condition);
    success(res, 'Customers retrieved successfully', {
      customers: rows,
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

/* GET '/customers/:id' */
router.get('/:id', async function (req, res, next) {
  try {
    const customer = await getCustomer(req);
    // Pending: query customer rental record

    success(res, 'Customer retrieved successfully', { customer });
  } catch (error) {
    failure(res, error);
  }
});

/* POST '/customers'
 * Record a new customer */
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req);

    const customer = await Customer.create(body);
    success(res, 'Customer created successfully', { customer });
  } catch (error) {
    failure(res, error);
  }
});

/* PUT '/customers/:id'
 * Update a customer */
router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req);

    const customer = await getCustomer(req);
    await customer.update(body);

    success(res, 'Customer updated successfully', { customer });
  } catch (error) {
    failure(res, error);
  }
});

/* DELETE '/customers/:id'
 * Delete a customer */
router.delete('/:id', async function (req, res, next) {
  try {
    const customer = await getCustomer(req);
    // Pending: 软删除&有ongoing订单不能删除
    await customer.destroy();

    success(res, 'Customer deleted successfully');
  } catch (error) {
    failure(res, error);
  }
});

/* Find a customer by its id from the request params, throw NotFound if it does not exist */
async function getCustomer(req) {
  const { id } = req.params;
  const customer = await Customer.findByPk(id);
  if (!customer) {
    throw new NotFound(`Customer with id ${id} not found`);
  }
  return customer;
}

/* Public function
 * Filter the body of the request
 * */
function filterBody(req) {
  return {
    name: req.body.name,
    phone: req.body.phone,
    driversLicense: req.body.driversLicense,
  };
}

module.exports = router;
