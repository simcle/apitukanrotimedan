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

const webhook = require('./src/routes/webhook');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard')
const companyRoutes = require('./src/routes/company');
const countryRoutes = require('./src/routes/country');
const branchRoutes = require('./src/routes/branches');
const userRoutes = require('./src/routes/users');
const employeeRoutes = require('./src/routes/employee');
const attendenceRoutes = require('./src/routes/attendence');
const categoryRoutes = require('./src/routes/category');
const brandRoutes = require('./src/routes/brand');
const productRoutes = require('./src/routes/product');

app.use('/webhook', webhook);
app.use('/auth', authRoutes);
app.use('/dashboard', authenticateToken, dashboardRoutes);
app.use('/setting', authenticateToken, companyRoutes);
app.use('/country', authenticateToken, countryRoutes);
app.use('/branches', authenticateToken, branchRoutes);
app.use('/users', authenticateToken, userRoutes);
app.use('/employee', authenticateToken, employeeRoutes);
app.use('/attendence', authenticateToken, attendenceRoutes);
app.use('/category', authenticateToken, categoryRoutes);
app.use('/brand', authenticateToken, brandRoutes);
app.use('/product', authenticateToken, productRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('server runing on PORT'+' '+PORT)
})