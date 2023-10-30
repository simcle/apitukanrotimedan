const dbPool = require('../config/database');

const summarySales = async () => {
    let sql;
    let stats = []
    sql = `SELECT SUM(sales.total) as total, sales.branch_id, branches.name as outlet FROM sales 
    LEFT JOIN branches ON branches.id = sales.branch_id
    WHERE sales.created_at >= DATE(NOW() - INTERVAL 7 DAY) AND sales.branch_id IS NOT NULL
    GROUP BY sales.branch_id`
    let colors = ['#4B5563','#DC2626','#F59E0B','#10B981','#8B5CF6','#3B82F6','#84cc16']
    let labels= []
    const [outlets] = await dbPool.execute(sql)
    let minDay = 7
    for(let i=0; i < outlets.length; i++) {
        const outlet = outlets[i]
        stats.push({
            branch_id: outlet.branch_id, 
            label: outlet.outlet, 
            total: parseInt(outlet.total), 
            data: [],
            borderColor: colors[i],
            backgroundColor: colors[i],
            fill: false,
            pointStyle: 'circle',
            pointRadius: 5,
        })
    }
    for(let i = 0; i < 7; i++) {
        minDay = minDay - 1
        const tanggal =  fd(minDay)
        labels.push(tanggal)
        for(let s=0; s < stats.length; s++) {
            const branch_id = stats[s].branch_id
            sql = `SELECT SUM(sales.total) as total FROM sales
                WHERE DATE(sales.created_at) = '${tanggal}' AND sales.branch_id=${branch_id}
                GROUP BY DATE(sales.created_at)`
            const [sales] = await dbPool.execute(sql)
            if(sales[0]) {
                stats[s].data.push(parseInt(sales[0].total))
            } else {
                stats[s].data.push(0)
            }
        }
    }
    function fd (e) {
        let d = new Date()
        d.setDate(d.getDate() - e)
        let dd = d.getDate()
        let mm = d.getMonth() + 1
        let yy = d.getFullYear()
        dd = checkTime(dd)
        mm =checkTime(mm)
        return `${yy}-${mm}-${dd}`
    }
    function checkTime (i) {
        if(i < 10) {
            i = `0${i}`
        }
        return i
    }
    sql = `SELECT COALESCE(SUM(total), 0) as today FROM sales WHERE DATE(created_at) = CURDATE() AND branch_id IS NOT NULL `
    const [totalToday] = await dbPool.execute(sql)
    sql = `SELECT COALESCE(SUM(total), 0) as yesterday FROM sales WHERE DATE(created_at) = CURRENT_DATE()-1 AND branch_id IS NOT NULL`
    const [totalYesterday] = await dbPool.execute(sql)
    sql = `SELECT COUNT(*) as today FROM sales WHERE DATE(created_at) = CURDATE() AND branch_id IS NOT NULL`
    const [countToday] = await dbPool.execute(sql)
    sql = `SELECT COUNT(*) as yesterday FROM sales WHERE DATE(created_at) = CURRENT_DATE()-1 AND branch_id IS NOT NULL`
    const [countYesterday] = await dbPool.execute(sql)
    sql = `SELECT COALESCE(SUM(sales_details.qty), 0) as today FROM sales 
        LEFT JOIN sales_details ON sales_details.sales_id = sales.id
        WHERE DATE(sales.created_at) = CURDATE() AND sales.branch_id IS NOT NULL`
    const [qtyToday] = await dbPool.execute(sql)
    sql = `SELECT COALESCE(SUM(sales_details.qty), 0) as yesterday FROM sales 
        LEFT JOIN sales_details ON sales_details.sales_id = sales.id
        WHERE DATE(sales.created_at) = CURRENT_DATE()-1 AND sales.branch_id IS NOT NULL`
    const[qtyYesterday] = await dbPool.execute(sql)
    
    let data = {
        labels: labels,
        stats: stats,
        totalToday: totalToday[0].today,
        totalYesterday: totalYesterday[0].yesterday,
        countToday: countToday[0].today,
        countYesterday: countYesterday[0].yesterday,
        qtyToday: qtyToday[0].today,
        qtyYesterday: qtyYesterday[0].yesterday
    }
    return data
}

const getAllsales = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let filter = body.filter
    let sql;
    const start = getDate(body.start)
    const end = getDate(body.end)
    if(filter) {
        filter = `'${filter.join("','")}'`
        sql = `SELECT COUNT(*) as count FROM sales WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' AND branch_id IN (${filter}) AND branch_id IS NOT NULL`
    } else {
        sql = `SELECT COUNT(*) as count FROM sales WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' AND branch_id IS NOT NULL`   
    }
    const [count] = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(filter) {
        sql = `SELECT sales.*, branches.name as outlet, users.name as kasir FROM sales 
        LEFT JOIN users ON users.id=sales.user_id
        LEFT JOIN branches ON branches.id=sales.branch_id
        WHERE (DATE(sales.created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' AND sales.branch_id IN (${filter}) AND sales.branch_id IS NOT NULL ORDER BY sales.created_at ASC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT sales.*, branches.name as outlet, users.name as kasir FROM sales 
        LEFT JOIN users ON users.id=sales.user_id
        LEFT JOIN branches ON branches.id=sales.branch_id
        WHERE (DATE(sales.created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' AND sales.branch_id IS NOT NULL ORDER BY sales.created_at ASC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
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
    const last_page = Math.ceil(totalItems / perPage)
    return {
        data: sales,
        pages: {
            current_page: currentPage,
            last_page: last_page,
            totalItems: totalItems
        }
    }
}
const downloadSales = async (body) => {
    let filter = body.filter
    const start = getDate(body.start)
    const end = getDate(body.end)
    let sql;
    if(filter) {
        filter = `'${filter.join("','")}'`
        sql = `SELECT sales.*, DATE_FORMAT(sales.created_at, '%d/%m/%Y %H:%i') as created_at, branches.name as outlet, users.name as kasir FROM sales 
        LEFT JOIN users ON users.id=sales.user_id
        LEFT JOIN branches ON branches.id=sales.branch_id
        WHERE (DATE(sales.created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' AND sales.branch_id IN (${filter}) ORDER BY sales.created_at ASC`
    } else {
        sql = `SELECT sales.*, DATE_FORMAT(sales.created_at, '%d/%m/%Y %H:%i') as created_at, branches.name as outlet, users.name as kasir FROM sales 
        LEFT JOIN users ON users.id=sales.user_id
        LEFT JOIN branches ON branches.id=sales.branch_id
        WHERE (DATE(sales.created_at) BETWEEN '${start}' AND '${end}') AND status='Posted' ORDER BY sales.created_at ASC`
    }
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
    return sales;

}
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
    summarySales,
    getAllsales,
    downloadSales,
    getDraft,
    getSalesBayBranch,
    insertSales,
    updateSales,
    deleteSales
}