const mongoose = require('mongoose');
const moment = require('moment-timezone');

/* from client side, we need title, desc, amount, createdAt */
const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'expense title is required']
    },
    amount: {
        type: Number,
        required: [true, 'expense amount is required']
    },
    user: {
        type: String,
        required: [true, 'user is required to create an expense']
    },
    localDate: {
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);


/*
{
  title: 'bat',
  description: 'bought a bat',
  amount: '100',
  localDate: '2025-05-01' 
}

YYYY-MM-DD
*/