const dbPool = require('../config/database');
const itemSummary = require('../modules/itemSummary');


const getAdjustmentByBranch = async (body) => {
    const branch_id = body
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let sql;
    sql =  `SELECT COUNT(*) as count FROM adjustment_items WHERE branch_id = '${branch_id}'`
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 

    sql = `SELECT * FROM adjustment_items 
        WHERE branch_id = '${branch_id}'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}
    `
    const [data] = await dbPool.execute(sql)
    for(let i = 0; i < data.length; i++) {
        const adjustmentId = data[i].id 
        sql = `SELECT * FROM adjustment_item_details WHERE adjustment_id='${adjustmentId}'`
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
    const branch_id = body.branch_id
    const user_id = body.user_id
    const note = body.note
    let sql =  `INSERT INTO adjustment_items (
        branch_id,
        user_id,
        note
    ) VALUES ('${branch_id}', '${user_id}', '${note}')`

    const [adjustment] = await dbPool.execute(sql)
    const insertId = adjustment.insertId

    for (let i=0; i < items.length; i++) {
        const item = items[i]
        sql = `INSERT INTO adjustment_item_details (
            adjustment_id,
            item_id,
            item_sku,
            item_name,
            in_stock,
            actual_stock,
            adjustment
        ) VALUES ('${insertId}', '${item.item_id}', '${item.sku}', '${item.name}', '${item.in_stock}', '${item.qty}', '${item.adjustment}')`
        await dbPool.execute(sql)
        const payload = {
            branch_id: branch_id,
            item_id: item.item_id,
            qty: item.qty,
            adjustment: item.adjustment
        }
        await itemSummary(payload, 'adjustment')
    }
    return 'OK'
}

module.exports = {
    getAdjustmentByBranch,
    insertAdjustments
}