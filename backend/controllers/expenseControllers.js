const ExpenseModel = require('../models/ExpenseModel');
const AppMessages = require('../utils/appMessages');
const {
    STATUS_BAD_REQUEST,
    STATUS_OK,
    STATUS_INTERNAL_SERVER_ERROR
} = require('../utils/constants');

const createExpense = async (req, res) => {
    try {
        const { title, amount, date } = req.body;
        if(!title || !amount || !date) {
            return res
            .status(STATUS_BAD_REQUEST)
            .json({ success: false, msg: 'Invalid', data: null });
        }
        const expense = await ExpenseModel.create({
            title, amount, user: req.user._id, localDate: date
        });
        res
        .status(STATUS_OK)
        .json({success: true, msg: 'Expense added successfully', data: expense});
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({success: false, msg: 'Some error occurred', data: null});
    }
}

const deleteExpense = async (req, res) => {
    try {
        const {id} = req.params;
        const expense = await ExpenseModel.findByIdAndDelete(id);
        res
        .status(STATUS_OK)
        .json({success: true, msg: AppMessages.EXPENSE_DELETED, data: expense});
    } catch (error) {
        res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .json({success: false, msg: 'Some error occurred', data: null});
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const {date} = req.body;
        const expenses = await ExpenseModel.find({user: req.user._id, localDate: date}).sort({ createdAt: -1 })
        res.status(STATUS_OK).json({
            success: true, msg: 'Expenses fetched', data: expenses
        });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            success: false, msg: 'Some error occurred', data: null
        });
    }
}

const aggregateExpenses = async (req, res) => {
    try {
        const userId = String(req.user._id);
        const result = await ExpenseModel.aggregate([
            {
                $match: { user: userId }
            },
            {
                $group: {
                    _id: '$localDate',
                    totalExpense: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 5
            }
        ]);
        result.reverse();
        res.status(200).json(result);
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            success: false, msg: 'Some error occurred', data: null
        });
    }
}

module.exports = {
    createExpense,
    deleteExpense,
    getAllExpenses,
    aggregateExpenses
}