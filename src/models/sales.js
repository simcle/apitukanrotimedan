const dbPool = require('../config/database');

const getDraft = async (body) => {
    const branch_id = body
    let sql = `SELECT * FROM sales WHERE branch_id=${branch_id} AND status = 'Draft'`
    const [sales] = await dbPool.execute(sql)
    for (let i = 0; i < sales.length; i++) {
        const saleId = sales[i].id
        sales[i].items = []
        let sql = `SELECT sales_details.*, item_variants.id as variant_id, item_variants.name as name, products.id as product_id, products.name as product FROM sales_details 
        LEFT JOIN item_variants ON item_variants.id = sales_details.variant_id 
        LEFT JOIN products ON products.id = item_variants.product_id WHERE sales_details.sales_id = ${saleId}`
        const [details] = await dbPool.execute(sql)
        sales[i].items = details
    }
    return sales
}

const getSalesBayBranch = async (body) => {
    const branch_id = body
    const today = getDate(new Date())
    let sql = `SELECT sales.*, users.name as kasir FROM sales LEFT JOIN users ON users.id = sales.user_id WHERE sales.branch_id=${branch_id} AND DATE(sales.created_at) = '${today}' AND sales.status = 'Posted' ORDER BY sales.id DESC`
    const [sales] = await dbPool.execute(sql)
    for (let i = 0; i < sales.length; i++) {
        const saleId = sales[i].id
        sales[i].items = []
        let sql = `SELECT sales_details.*, item_variants.id as variant_id, item_variants.name as name, products.id as product_id, products.name as product FROM sales_details 
        LEFT JOIN item_variants ON item_variants.id = sales_details.variant_id 
        LEFT JOIN products ON products.id = item_variants.product_id 
        WHERE sales_details.sales_id = ${saleId}`
        const [details] = await dbPool.execute(sql)
        sales[i].items = details
    }
    return sales
}

const insertSales = async (body) => {
    const items = body.items
    let sql = `INSERT INTO sales (
        sales_no,
        customer_id,
        customer,
        total,
        payment_method,
        payment_amount,
        bank_id,
        change_amount,
        status,
        branch_id,
        user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let values = [
        body.sales_no,
        body.customer_id,
        body.customer,
        body.total,
        body.payment_method,
        body.payment_amount,
        body.bank_id,
        body.change_amount,
        body.status,
        body.branch_id,
        body.user_id
    ]
    const [sales] = await dbPool.execute(sql, values)
    const insertId = sales.insertId
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        let sql = `INSERT INTO sales_details (
            sales_id,
            variant_id,
            cogs,
            price,
            qty,
            total
        ) VALUES (?, ?, ?, ?, ?, ?)`
        let values = [
            insertId,
            item.variant_id,
            item.cogs,
            item.price,
            item.qty,
            item.total
        ]
        await dbPool.execute(sql, values)
    }
    return 
}
const updateSales = async (body) => {
    const items = body.items
    let sql = `UPDATE sales SET 
    customer_id=?, 
    customer=?, 
    total=?,
    payment_method=?,
    payment_amount=?,
    bank_id=?,
    change_amount=?,
    status=?
    WHERE id=?`
    let values = [
        body.customer_id,
        body.customer,
        body.total,
        body.payment_method,
        body.payment_amount,
        body.bank_id,
        body.change_amount,
        body.status,
        body.id
    ]
    await dbPool.execute(sql, values)
    sql = `DELETE FROM sales_details WHERE sales_id=${body.id}`
    await dbPool.execute(sql)
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        let sql = `INSERT INTO sales_details (
            sales_id,
            variant_id,
            cogs,
            price,
            qty,
            total
        ) VALUES (?, ?, ?, ?, ?, ?)`
        let values = [
            body.id,
            item.variant_id,
            item.cogs,
            item.price,
            item.qty,
            item.total
        ]
        await dbPool.execute(sql, values)
    }
    return
}


const deleteSales = async (id) => {
    let sql = `DELETE FROM sales WHERE id = ${id}`
    await dbPool.execute(sql)
    sql = `DELETE FROM sales_details WHERE sales_id=${id}`
    await dbPool.execute(sql)
    return
}

function getDate (i) {
    let date = new Date(i)
    let d = date.getDate()
    let m = date.getMonth() +1
    let y = date.getFullYear()
    d = checktime(d)
    m = checktime(m)
    function checktime (i) {
        if(i < 10) {
            return i = `0${i}`
        }
        return i
    }
    return`${y}-${m}-${d}`
}


module.exports = {
    getDraft,
    getSalesBayBranch,
    insertSales,
    updateSales,
    deleteSales
}