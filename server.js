const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const dir = path.join(__dirname, 'public');
app.use('/public/', express.static(dir));

const migrate = require('./src/database/migrate')
migrate()
const updateProductPrice = require('./src/database/productPrices')
// updateProductPrice()

const tasks = require('./src/modules/tasks');

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
const ingredientCategoriesRoutes = require('./src/routes/ingredientCategories');
const ingredientUnitsRoutes = require('./src/routes/ingredientUnits');
const ingredientRoutes = require('./src/routes/ingredients');
const receipeRoutes = require('./src/routes/receipes');
const brandRoutes = require('./src/routes/brand');
const productRoutes = require('./src/routes/product');
const itemsRoutes = require('./src/routes/items');
const customerRoutes = require('./src/routes/customer');
const saleRoutes = require('./src/routes/sales');
const paymentMethodRoutes = require('./src/routes/paymentMethod');
const printerRoutes = require('./src/routes/printer');
const supplierRoutes = require('./src/routes/suppliers');
const purchasingRoutes = require('./src/routes/purchasing');
const summaryIngredientRoutes = require('./src/routes/summeryIngredients');
const adjustmentIngredientRoutes = require('./src/routes/adjustmentIngredients');
const transferIngredientRoutes = require('./src/routes/transferIngredients');
const inventoryInredientRoutes = require('./src/routes/inventoryIngredients');
const inventoryItemRoutes = require('./src/routes/inventoryItems');
const incomingItemRoutes = require('./src/routes/incomingItems');
const adjustmentItemRoutes = require('./src/routes/adjustmentItems');

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
app.use('/ingredient-categories', authenticateToken, ingredientCategoriesRoutes);
app.use('/ingredient-units', authenticateToken, ingredientUnitsRoutes);
app.use('/ingredients', authenticateToken, ingredientRoutes);
app.use('/receipes', authenticateToken, receipeRoutes);
app.use('/brand', authenticateToken, brandRoutes);
app.use('/product', authenticateToken, productRoutes);
app.use('/items', authenticateToken, itemsRoutes);
app.use('/customer', authenticateToken, customerRoutes);
app.use('/sales', authenticateToken, saleRoutes);
app.use('/payment-method', authenticateToken, paymentMethodRoutes);
app.use('/printer', authenticateToken, printerRoutes);
app.use('/suppliers', authenticateToken, supplierRoutes);
app.use('/purchasing', authenticateToken, purchasingRoutes);
app.use('/summary-ingredients', authenticateToken, summaryIngredientRoutes);
app.use('/adjustment-ingredients', authenticateToken, adjustmentIngredientRoutes)
app.use('/transfer-ingredients', authenticateToken, transferIngredientRoutes)
app.use('/inventory-ingredients', authenticateToken, inventoryInredientRoutes);
app.use('/inventory-items', authenticateToken, inventoryItemRoutes);
app.use('/incoming', authenticateToken, incomingItemRoutes)
app.use('/adjustment-items', authenticateToken, adjustmentItemRoutes);

cron.schedule('0 1 * * *', async () => {
    await tasks.summary_ingredients()
    await tasks.summary_items()
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('server runing on PORT'+' '+PORT)
})