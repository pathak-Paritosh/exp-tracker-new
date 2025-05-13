import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Last5DaysExpensesChart({ lastFiveDaysExpenses: data }) {

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3>Last 5 Days Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalExpense" fill="#0F4C81" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
