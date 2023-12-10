const dbPool = require('../config/database');
const summary = require('../modules/summary')
const moment = require('moment')

const getAllAdjustment = async (body) => {
    const start = moment(body.start).format('YYYY-MM-DD')
    const end = moment(body.end).format('YYYY-MM-DD')
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let filter = body.filter
    let sql;
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT COUNT(*) FROM adjustment_ingredients WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND branch_id IN ('${branch}')`
    } else {
        sql = `SELECT COUNT(*) as count FROM adjustment_ingredients WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}')`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT adjustment_ingredients.*, users.name as user_name, branches.name as outlet_name FROM adjustment_ingredients 
        LEFT JOIN users ON users.id = adjustment_ingredients.user_id
        LEFT JOIN branches ON branches.id = adjustment_ingredients.branch_id
        WHERE (DATE(adjustment_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND adjustment_ingredients.branch_id IN ('${branch}')
        ORDER BY adjustment_ingredients.id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT adjustment_ingredients.*, users.name as user_name, branches.name as outlet_name FROM adjustment_ingredients 
        LEFT JOIN users ON users.id = adjustment_ingredients.user_id
        LEFT JOIN branches ON branches.id = adjustment_ingredients.branch_id
        WHERE (DATE(adjustment_ingredients.created_at) BETWEEN '${start}' AND '${end}')
        ORDER BY adjustment_ingredients.id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)

    for(let i = 0; i < data.length; i++) {
        const adjustmentId = data[i].id 
        sql = `SELECT * FROM adjustment_ingredient_details WHERE adjustment_id='${adjustmentId}'`
        const [items] = await dbPool.execute(sql)
        data[i].items = items
    }
    const last_page = Math.ceil(totalItems / perPage)
    return {
        data: data,
        pages: {
            current_page: currentPage,
            last_page: last_page,
            totalItems: totalItems
        }
    }

}

const getAdjustmentByBranch = async (body) => {
    const branch_id = body
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let sql;

    sql =  `SELECT COUNT(*) as count FROM adjustment_ingredients WHERE branch_id = '${branch_id}'`
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    sql = `SELECT * FROM adjustment_ingredients 
        WHERE branch_id = '${branch_id}'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}
    `
    const [data] = await dbPool.execute(sql)
    for(let i = 0; i < data.length; i++) {
        const adjustmentId = data[i].id 
        sql = `SELECT * FROM adjustment_ingredient_details WHERE adjustment_id='${adjustmentId}'`
        const [items] = await dbPool.execute(sql)
        data[i].items = items
    }
    const last_page = Math.ceil(totalItems / perPage)
    return {
        data: data,
        pages: {
            current_page: currentPage,
            last_page: last_page,
            totalItems: totalItems
        }
    }
}

const insertAdjustments = async (body) => {
    const items = body.items
    let sql = `INSERT INTO adjustment_ingredients (
        branch_id,
        user_id,
        note
    ) VALUES (?, ?, ?)`
    let values = [
        body.branch_id,
        body.user_id,
        body.note
    ]
    const [adjustment] = await dbPool.execute(sql, values)
    const insertId = adjustment.insertId

    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        sql = `INSERT INTO adjustment_ingredient_details (
            adjustment_id,
            ingredient_id,
            ingredient_name,
            in_stock,
            actual_stock,
            adjustment,
            unit_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        values = [
            insertId,
            item.ingredient_id,
            item.ingredient_name,
            item.in_stock,
            item.actual_stock,
            item.adjustment,
            item.unit_name
        ]
        await dbPool.execute(sql, values)
        const data = {
            branch_id: body.branch_id,
            ingredient_id: item.ingredient_id,
            qty: item.actual_stock,
            adjustment: item.adjustment
        }
        await summary(data, 'Adjustment')
    }
}

module.exports = {
    getAllAdjustment,
    getAdjustmentByBranch,
    insertAdjustments
}