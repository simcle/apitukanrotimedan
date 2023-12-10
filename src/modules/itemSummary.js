const dbPool = require('../config/database');
const moment = require('moment');

const summary = async (body, type) => {
    const date = moment().format('YYYY-MM-DD')
    const branch_id = body.branch_id
    const item_id = body.item_id
    const qty = body.qty
    const adjustment = body.adjustment
    let ending;
    let sql;
    sql = `SELECT * FROM summary_items WHERE branch_id = '${branch_id}' AND item_id = '${item_id}' AND DATE(created_at) = '${date}'`
    const [data] = await dbPool.execute(sql)
    if(data.length > 0) {
        switch (type) {
            case 'sales':
                let sales = data[0].sales + qty
                ending = data[0].ending - qty
                sql = `UPDATE summary_items SET sales = '${sales}', ending = '${ending}' WHERE branch_id='${branch_id}' AND item_id = '${item_id}' AND DATE(created_at) = '${date}'`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
            case 'incoming': 
                let incoming = data[0].incoming + qty
                ending = data[0].ending + qty
                sql = `UPDATE summary_items SET incoming = '${incoming}', ending = '${ending}' WHERE branch_id = '${branch_id}' AND item_id = '${item_id}' AND DATE(created_at) = '${date}'`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
            case 'adjustment': 
                let adj = data[0].adjustment + adjustment
                ending = qty
                sql = `UPDATE summary_items SET adjustment = '${adj}', ending = '${ending}' WHERE branch_id = '${branch_id}' AND item_id = '${item_id}' AND DATE(created_at) = '${date}'`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
        }
    } else {
        sql = `SELECT item_variants.sku as sku, item_variants.name as name, products.name as product FROM item_variants
            LEFT JOIN products ON item_variants.product_id = products.id
            WHERE item_variants.id = '${item_id}'
        `
        const [data] = await dbPool.execute(sql)
        let beginning;
        let sales;
        let incoming;
        let adjustment;
        let ending
        let item_name;
        let sku = data[0].sku
        if(data[0].name) {
            item_name = `${data[0].product} - ${data[0].name}`
        } else {
            item_name = data[0].product
        }
        switch (type) {
            case 'sales': 
                sales = qty
                beginning = 0
                ending = 0 - qty
                sql = `INSERT INTO summary_items (
                    branch_id,
                    item_id,
                    item_sku,
                    item_name,
                    beginning,
                    sales,
                    ending
                ) VALUES ('${branch_id}', '${item_id}', '${sku}', '${item_name}', '${beginning}', '${sales}', '${ending}')`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
            case 'incoming': 
                incoming = qty
                beginning = 0
                ending = qty
                sql = `INSERT INTO summary_items (
                    branch_id,
                    item_id,
                    item_sku,
                    item_name,
                    beginning,
                    incoming,
                    ending
                ) VALUES ('${branch_id}', '${item_id}', '${sku}', '${item_name}', '${beginning}', '${incoming}', '${ending}')`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
            case 'adjustment': 
                adjustment = qty
                beginning = 0
                ending = qty
                sql = `INSERT INTO summary_items (
                    branch_id,
                    item_id,
                    item_sku,
                    item_name,
                    beginning,
                    adjustment,
                    ending
                ) VALUES ('${branch_id}', '${item_id}', '${sku}', '${item_name}', '${beginning}', '${adjustment}', '${ending}')`
                await dbPool.execute(sql)
                await updateStock(branch_id, item_id, ending)
                break;
        }
    }
}

const updateStock = async (branch_id, item_id, qty) => {
    let sql = `SELECT * FROM inventory_items WHERE branch_id = '${branch_id}' AND item_id = '${item_id}'`
    const [ready] = await dbPool.execute(sql)
    if(ready.length > 0) {
        sql = `UPDATE inventory_items SET qty = '${qty}' WHERE branch_id = '${branch_id}' AND item_id = '${item_id}'`
        await dbPool.execute(sql)
    } else {
        sql = `INSERT INTO inventory_items (
            branch_id,
            item_id,
            qty
        ) VALUES ('${branch_id}', '${item_id}', '${qty}')`

        await dbPool.execute(sql)
    }
}

module.exports = summary