const dbPool = require('../config/database');
const summary = require('../modules/summary');
const getAllSupplier = async () => {
    let sql = `SELECT * FROM suppliers`
    return await dbPool.execute(sql);
} 
const getIngredients = async (body) => {
    const search = body.search
    const branch_id = body.branch_id
    let sql;
    sql = `SELECT ingredients.*, ingredient_units.name as unit_name, inventory_ingredients.qty as in_stock FROM ingredients
    LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
    LEFT JOIN inventory_ingredients ON inventory_ingredients.ingredient_id = ingredients.id AND inventory_ingredients.branch_id = '${branch_id}'
    WHERE ingredients.name LIKE '%${search}%'
    ORDER BY ingredients.name ASC
    LIMIT 10`
    const [data] = await dbPool.execute(sql)
    return data
}
const getAllPurchasing = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let sql;
    let filter = body.filter

    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT COUNT(*) as count FROM purchasing
        LEFT JOIN suppliers ON suppliers.id = purchasing.supplier_id
        WHERE suppliers.name LIKE '%${search}%' AND purchasing.branch_id IN ('${branch}')`
    } else {
        sql = `SELECT COUNT(*) as count FROM purchasing
        LEFT JOIN suppliers ON suppliers.id = purchasing.supplier_id
        WHERE suppliers.name LIKE '%${search}%'`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT purchasing.*, suppliers.name as supplier_name, branches.name as branch_name FROM purchasing
        LEFT JOIN suppliers ON suppliers.id = purchasing.supplier_id
        LEFT JOIN branches ON branches.id = purchasing.branch_id
        WHERE suppliers.name LIKE '%${search}%' AND purchasing.branch_id IN ('${branch}')
        ORDER BY purchasing.id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT purchasing.*, suppliers.name as supplier_name, branches.name as branch_name FROM purchasing
        LEFT JOIN suppliers ON suppliers.id = purchasing.supplier_id
        LEFT JOIN branches ON branches.id = purchasing.branch_id
        WHERE suppliers.name LIKE '%${search}%'
        ORDER BY purchasing.id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        const purchasingId = data[i].id 
        sql = `SELECT purchasing_details.*, ingredients.name as ingredient_name, ingredient_units.name as unit_name
        FROM purchasing_details
        LEFT JOIN ingredients ON ingredients.id = purchasing_details.ingredient_id
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
        WHERE purchasing_details.purchasing_id = '${purchasingId}'`
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
const getPurchasingByBranch = async (body) => {
    const branch_id = body.branch_id
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 10
    let totalItems;
    let search = body.search
    let sql;
    sql = `SELECT COUNT(*) as count FROM purchasing
    LEFT JOIN suppliers ON suppliers.id = purchasing.supplier_id
    WHERE purchasing.branch_id = '${branch_id}' AND suppliers.name LIKE '%${search}%'`
    const [count] = await dbPool.execute(sql);
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(search) {
        sql = `SELECT purchasing.*, suppliers.name as supplier_name FROM purchasing
        LEFT JOIN suppliers ON purchasing.supplier_id = suppliers.id
        WHERE purchasing.branch_id = '${branch_id}' AND suppliers.name LIKE '%${search}%'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT purchasing.*, suppliers.name as supplier_name FROM purchasing
        LEFT JOIN suppliers ON purchasing.supplier_id = suppliers.id
        WHERE purchasing.branch_id = '${branch_id}'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        const purchasingId = data[i].id 
        sql = `SELECT purchasing_details.*, ingredients.name as ingredient_name, ingredient_units.name as unit_name
        FROM purchasing_details
        LEFT JOIN ingredients ON ingredients.id = purchasing_details.ingredient_id
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
        WHERE purchasing_details.purchasing_id = '${purchasingId}'`
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
const insertPurchasing = async (body) => {
    const purchasingNo = `# ${Math.floor(Date.now()/1000)}`
    const items = body.items
    let sql;
    sql = `INSERT INTO purchasing (
        purchasing_no,
        branch_id,
        supplier_id,
        note,
        status,
        total
    ) VALUES (?, ?, ?, ?, ?, ?)`
    let values = [
        purchasingNo,
        body.branch_id,
        body.supplier_id,
        body.note,
        body.status,
        body.total
    ]
    const [purchasing] = await dbPool.execute(sql, values)
    const purchasingId = purchasing.insertId
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        sql = `INSERT INTO purchasing_details (
            purchasing_id,
            ingredient_id,
            in_stock,
            qty,
            unit_cost,
            sub_total
        ) VALUES (?, ?, ?, ?, ?, ?)`
        values = [
            purchasingId,
            item.ingredient_id,
            item.in_stock,
            item.qty,
            item.unit_cost,
            item.subTotal
        ]
        await dbPool.execute(sql, values)
        if(body.status == 'Completed') {
            const data = {
                branch_id: body.branch_id,
                ingredient_id: item.ingredient_id,
                qty: item.qty
            }
            sql = `UPDATE ingredients SET unit_cost='${item.unit_cost}' WHERE id='${item.ingredient_id}'`
            await dbPool.execute(sql)
            await summary(data, 'Purchasing')
        }
    }
    return 'OK'
}

const updatePurchasing = async (body) => {
    const purchasingId = body.id
    const items = body.items
    const deletes = body.deletes
    let sql = `UPDATE purchasing SET note='${body.note}', status='${body.status}', total='${body.total}' WHERE id='${purchasingId}'`
    await dbPool.execute(sql)
    
    for(let i = 0; i < items.length; i++) {
        const item = items[i]
        sql = `SELECT * FROM purchasing_details WHERE id = '${item.id}'`
        const [data] = await dbPool.execute(sql)
        if(data.length > 0) {
            sql = `UPDATE purchasing_details SET qty='${item.qty}', unit_cost='${item.unit_cost}', sub_total='${item.sub_total}' WHERE id='${item.id}'`
            await dbPool.execute(sql)
        } else {
            sql = `INSERT INTO purchasing_details (
                purchasing_id,
                ingredient_id,
                in_stock,
                qty,
                unit_cost,
                sub_total
            ) VALUES (?, ?, ?, ?, ?, ?)`
            let values = [
                purchasingId,
                item.ingredient_id,
                item.in_stock,
                item.qty,
                item.unit_cost,
                item.sub_total
            ]
            await dbPool.execute(sql, values)
        }
        if(body.status == 'Completed') {
            const data = {
                branch_id: 8,
                ingredient_id: item.ingredient_id,
                qty: item.qty
            }
            sql = `UPDATE ingredients SET unit_cost='${item.unit_cost}' WHERE id='${item.ingredient_id}'`
            await dbPool.execute(sql)
            await summary(data, 'Purchasing')
        }
    }
    for(let i = 0; i < deletes.length; i++) {
        sql =  `DELETE FROM purchasing_details WHERE id = '${deletes[i].id}'`
        await dbPool.execute(sql)
    }
    return 'OK'
}

const cancelPurchasing = async (id) => {
    let sql = `UPDATE purchasing SET status='Cancelled' WHERE id='${id}'`
    await dbPool.execute(sql)
    return 'OK'
}


module.exports = {
    getIngredients,
    getAllSupplier,
    getAllPurchasing,
    getPurchasingByBranch,
    insertPurchasing,
    updatePurchasing,
    cancelPurchasing,
}