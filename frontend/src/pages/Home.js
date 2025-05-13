import './Home.css';
import AddExpenseForm from '../components/AddExpenseForm';
import { useEffect, useState } from 'react';
import { FaRegCalendar } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import Last5DaysExpensesChart from '../components/ExpenseChart';

export default function Home() {
    const today = new Date().toISOString().split('T')[0];

    const [expenses, setExpenses] = useState(null);
    const [expenseDate, setExpenseDate] = useState(today);
    const [totAmount, setTotAmount] = useState(0);
    const [lastFiveDaysExpenses, setLastFiveDaysExpenses] = useState(null);
    const {user} = useAuth();

    const addExpense = (newExpense) => {
        setExpenses([newExpense, ...expenses]);
    }

    const deleteExpense = (id) => {
        setExpenses(prevExpenses => {
            return prevExpenses.filter((exp) => exp._id !== id)
        })
    }

    const handleClick = async (id) => {
        const URI = `${process.env.REACT_APP_API_BASE_URL}/api/expenses/` + id;
        try {
            const res = await fetch(URI, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            deleteExpense(id);
        } catch (err) {
            
        }
    }

    useEffect(() => {
        const fetchExpenses = async () => {
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/expenses`;
            try {
                const res = await fetch(URI, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({date: expenseDate})
                });
                const json = await res.json();
                if(!res.ok) {
                    throw new Error(json.msg);
                }
                setExpenses(json.data);
            } catch (err) {

            }
        }
        fetchExpenses();
    }, [expenseDate, user.token]);

    useEffect(() => {
        if (expenses && expenses.length > 0) {
            let tot = 0;
            for (let i = 0; i < expenses.length; i++) {
                tot += +(expenses[i].amount);
            }
            setTotAmount(tot);
        } else {
            setTotAmount(0);
        }
    }, [expenses]);

    useEffect(() => {
        const fetchLastFiveDaysExpenses = async () => {
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/expenses/aggregate`;
            try {
                const res = await fetch(URI, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const json = await res.json();
                setLastFiveDaysExpenses(json);
            } catch (err) {

            }
        }
        fetchLastFiveDaysExpenses();
    }, [expenses, user.token]);


    return (
        <div className="home-section section">
            <div className="container">
                <div className="home">
                    <h2 className='manage-expense-title'>Track Your Expenses</h2>
                    <AddExpenseForm addExpense={addExpense} />
                    <div className="expense-date-details">
                        <div className='expense-date-amount-details'>
                            <p className='date-of-expense'>Expenses made on: <em>{expenseDate}</em></p>
                            <p className='expenses-amount-tot'>Total Amount: Rs {totAmount}</p>
                        </div>
                        <div>
                            <input
                                type="date"
                                onChange={(e) => setExpenseDate(e.target.value)}
                            />
                        </div>
                        <FaRegCalendar size={17} className='fa-calender' />
                    </div>
                    <div className="expenses-list">
                        { expenses && expenses.length > 0 && expenses.map(exp => (
                            <div className="ind-expense" key={exp._id}>
                                <p>{exp.title}</p>
                                <p className='expense-amount'>Rs {exp.amount}</p>
                                <div className='delete-expense' onClick={() => handleClick(exp._id)}>x</div>
                            </div>
                        )) }
                        {
                            expenses &&
                            expenses.length === 0 &&
                            <div className="no-expenses-available">
                                <h3>No expenses available</h3>
                            </div>
                        }
                    </div>
                    <div className="expense-graph">
                        <Last5DaysExpensesChart lastFiveDaysExpenses={lastFiveDaysExpenses} />
                    </div>
                </div>
            </div>
        </div>
    )
}