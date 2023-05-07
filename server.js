const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dir = path.join(__dirname, 'public');
app.use('/public/', express.static(dir));

const migrate = require('./src/database/migrate')
migrate()

const authenticateToken = require('./authenticate');

const authRoutes = require('./src/routes/auth');
const webhook = require('./src/routes/webhook');
const companyRoutes = require('./src/routes/company');
const countryRoutes = require('./src/routes/country');
const merchantRoutes = require('./src/routes/merchants');
const employeeRoutes = require('./src/routes/employee');

app.use('/webhook', webhook);
app.use('/auth', authRoutes);
app.use('/setting', authenticateToken, companyRoutes);
app.use('/country', authenticateToken, countryRoutes);
app.use('/merchants', authenticateToken, merchantRoutes);
app.use('/employee', authenticateToken, employeeRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('server runing on PORT'+' '+PORT)
})