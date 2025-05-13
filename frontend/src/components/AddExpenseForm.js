import { useAuth } from '../hooks/useAuth';
import './AddExpenseForm.css';
import { useState } from 'react';

export default function AddExpenseForm({ addExpense }) {
    const today = new Date().toISOString().split('T')[0];
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseDate, setExpenseDate] = useState(today);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/expenses/create`;
            const data = { title: expenseTitle, amount: expenseAmount, date: expenseDate };
            const res = await fetch(URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(data)
            })
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            if(today === expenseDate) {
                addExpense(json.data);
            }
            setExpenseAmount('');
            setExpenseDate(today);
            setExpenseTitle('');
        } catch (err) {
        }
    }

    return (
        <form className='add-expense-form' onSubmit={handleSubmit}>
            <h3>Add an Expense</h3>
            <div className='expense-title-container'>
                <input
                    type="text"
                    placeholder='Enter Expense Title'
                    value={expenseTitle}
                    autoComplete='off'
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    required
                />
            </div>
            <div className='expense-amount-container'>
                <input
                    type="number"
                    min={0}
                    placeholder='Enter Expense Amount (in Rs)'
                    value={expenseAmount}
                    autoComplete='off'
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                />
            </div>
            <div className='expense-date-container'>
                <input
                    type="date"
                    value={expenseDate}
                    autoComplete='off'
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                />
                <p className='expense-date-placeholder'>(Expense date: DD-MM-YYYY)</p>
            </div>
            <div>
                <button>Add</button>
            </div>
        </form>
    )
}