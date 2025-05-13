const express = require('express');
const expenseRoutes = express.Router();
const {
    createExpense,
    deleteExpense,
    getAllExpenses,
    aggregateExpenses
} = require('../controllers/expenseControllers');
const { authenticate } = require('../middlewares/authMiddleware');

expenseRoutes.use(authenticate);

expenseRoutes.post('/create', createExpense);
expenseRoutes.delete('/:id', deleteExpense);
expenseRoutes.post('/', getAllExpenses);
expenseRoutes.get('/aggregate', aggregateExpenses);

module.exports = expenseRoutes;