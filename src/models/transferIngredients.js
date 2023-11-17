const dbPool = require('../config/database');
const moment = require('moment');
const summary = require('../modules/summary');

const getAllTransfer = async (body) => {
    const start = moment(body.start).format('YYYY-MM-DD')
    const end = moment(body.end).format('YYYY-MM-DD')
    const filter = body.filter
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let sql
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT COUNT(*) as count FROM transfer_ingredients 
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND to_outlet_id iN ('${branch}')`
    } else {
        sql = `SELECT COUNT(*) as count FROM transfer_ingredients 
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}')`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT transfer_ingredients.*, branches.name as branch_name, users.name as user_name
        FROM transfer_ingredients
        LEFT JOIN branches ON branches.id = transfer_ingredients.to_outlet_id
        LEFT JOIN users ON users.id = transfer_ingredients.user_id
        WHERE (DATE(transfer_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND transfer_ingredients.to_outlet_id IN ('${branch}')
        ORDER BY transfer_ingredients. id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT transfer_ingredients.*, branches.name as branch_name, users.name as user_name
        FROM transfer_ingredients
        LEFT JOIN branches ON branches.id = transfer_ingredients.to_outlet_id
        LEFT JOIN users ON users.id = transfer_ingredients.user_id
        WHERE (DATE(transfer_ingredients.created_at) BETWEEN '${start}' AND '${end}')
        ORDER BY transfer_ingredients.id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)

    for (let i = 0; i < data.length; i++) {
        const transferId = data[i].id
        sql = `SELECT transfer_ingredient_details.*, ingredients.name as ingredient_name, ingredient_units.name as unit_name
        FROM transfer_ingredient_details
        LEFT JOIN ingredients ON ingredients.id = transfer_ingredient_details.ingredient_id
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
        WHERE transfer_id = '${transferId}'`
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

const insertTransfer = async (body) => {
    const transferNo = `#TF${Math.floor(Date.now()/1000)}`
    const items = body.items
    let sql = `INSERT INTO transfer_ingredients (
        transfer_no,
        to_outlet_id,
        note,
        user_id
    ) VALUES (?, ?, ?, ?)`
    let values = [
        transferNo,
        body.outlet_id,
        body.note,
        body.user_id
    ]
    const [transfer] = await dbPool.execute(sql, values)
    const transferId = transfer.insertId
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        sql = `INSERT INTO transfer_ingredient_details (
            transfer_id,
            ingredient_id,
            in_stock,
            qty
        ) VALUES (?, ?, ?, ?)`
        values = [
            transferId,
            item.ingredient_id,
            item.in_stock,
            item.qty
        ]
        await dbPool.execute(sql, values)
        const data = {
            branch_id: body.outlet_id,
            ingredient_id: item.ingredient_id,
            qty: item.qty
        }
        await summary(data, 'Transfer')
    }

    return 'OK'
}

module.exports = {
    getAllTransfer,
    insertTransfer
}