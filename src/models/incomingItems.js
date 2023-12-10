const dbPool = require('../config/database');
const summaryIngredient = require('../modules/summary');
const itemSummary = require('../modules/itemSummary');

const getItems = async (body) => {
    const branch_id = body.branch_id
    const search = body.search
    let sql = `SELECT item_variants.*, products.name as product, inventory.qty as in_stock FROM item_variants
        LEFT JOIN products ON item_variants.product_id = products.id
        LEFT JOIN (SELECT * FROM inventory_items WHERE branch_id = '${branch_id}') as inventory ON item_variants.id = inventory.item_id
        WHERE item_variants.sku = '${search}' OR products.name LIKE '%${search}%'
        LIMIT 10
    `
    const [data] = await dbPool.execute(sql)
    return data
}
const getIncoming = async (body) => {
    const branch_id = body.branch_id
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 10
    let totalItems;
    let sql;
    sql = `SELECT COUNT(*) as count FROM incoming_items WHERE branch_id ='${branch_id}'`
    const [count] = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    sql = `SELECT * FROM incoming_items WHERE branch_id = '${branch_id}'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}
    `
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        const incomingId = data[i].id
        sql = `SELECT incoming_item_details.*, products.name as product, item_variants.name as name, item_variants.sku as sku
            FROM incoming_item_details
            LEFT JOIN item_variants ON incoming_item_details.item_id = item_variants.id
            LEFT JOIN products ON item_variants.product_id = products.id
            WHERE incoming_item_details.incoming_id = '${incomingId}'
        `
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
const insertIncoming = async (body) => {
    const incoming_no = `# ${Math.floor(Date.now()/1000)}`
    const branch_id = body.branch_id
    const user_id = body.user_id
    const note = body.note
    const items = body.items
    let sql = `INSERT INTO incoming_items (
        incoming_no,
        branch_id,
        note,
        user_id
    ) VALUES ('${incoming_no}', '${branch_id}', '${note}', '${user_id}')`
    const [incoming] = await dbPool.execute(sql)
    const incomingId = incoming.insertId
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        sql = `INSERT INTO incoming_item_details (
            incoming_id,
            item_id,
            in_stock,
            qty
        ) VALUES ('${incomingId}', '${item.item_id}', '${item.in_stock}', '${item.qty}')`
        await dbPool.execute(sql)
        const payload = {
            branch_id: branch_id,
            item_id: item.item_id,
            qty: item.qty
        }
        await itemSummary(payload, 'incoming')
        
        sql = `SELECT receipes.variant_id as item_id, receipe_ingredients.ingredient_id as ingredient_id, receipe_ingredients.qty as qty FROM receipes
            LEFT JOIN receipe_ingredients ON receipes.id = receipe_ingredients.receipe_id
            WHERE receipes.variant_id = '${item.item_id}'
        `
        const [receipes] = await dbPool.execute(sql)
        for(let r = 0; r < receipes.length; r++) {
            const receipe = receipes[r]
            const used = parseFloat(receipe.qty) * parseInt(item.qty)
            const payload = {
                branch_id: branch_id,
                ingredient_id: receipe.ingredient_id,
                qty: used
            }
            await summaryIngredient(payload, 'Usage')
        }
    }
    return 'OK'
}

module.exports = {
    getItems,
    getIncoming,
    insertIncoming
}