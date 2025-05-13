const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./utils/config');
const {
    USER_BASE_PATH,
    EXPENSE_BASE_PATH
} = require('./utils/constants');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(config.DB_URI)
.then(() => {
    app.listen(PORT, () => {
    })
}).catch((error) => {
    process.exit(0);
})

app.use(USER_BASE_PATH, userRoutes);
app.use(EXPENSE_BASE_PATH, expenseRoutes);