const dbPool = require('../config/database');

const updateProductPrice = async () => {
    let sql;
    sql = `SELECT id FROM branches`
    const [branches] = await dbPool.execute(sql);
    sql = `SELECT id, price FROM item_variants`
    const [variants] = await dbPool.execute(sql);
    for(let v = 0; v < variants.length; v++) {
        const variant = variants[v]
        let price;
        if(variant.price) {
            price = variant.price
        } else {
            price = 0
        }
        for(let b = 0; b < branches.length; b++) {
            const branchId = branches[b].id 
            sql = `SELECT id FROM item_prices WHERE variant_id='${variant.id}' AND branch_id='${branchId}'`
            const [data] = await dbPool.execute(sql)
            if(data.length == 0) {
                sql = `INSERT INTO item_prices(
                    variant_id,
                    branch_id,
                    price
                ) VALUES ('${variant.id}', '${branchId}', '${price}')`
                await dbPool.execute(sql);
            }
        }
    }
}

module.exports = updateProductPrice