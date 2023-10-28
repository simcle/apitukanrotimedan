const fs = require('fs');
const dbPool = require('../config/database');

const getFilter = async () => {
    let sql;
    sql = 'SELECT * FROM categories ORDER BY name ASC'
    const [categories] = await dbPool.execute(sql)
    sql = `SELECT COUNT(id) as count FROM products`
    const [count] = await dbPool.execute(sql)
    const data = {
        categories: categories,
        count: count[0].count
    }
    return data
}
const getAllProduct = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let filter = body.filter
    let sql;
    if(filter) {
        sql = `SELECT COUNT(*) as count FROM products WHERE name LIKE '%${search}%' AND category_id IN (${filter})`
    } else {
        sql = `SELECT COUNT(*) as count FROM products WHERE name LIKE '%${search}%'`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(filter) {
        sql = `SELECT products.*, categories.name as category, brands.name as brand FROM products LEFT JOIN categories ON categories.id = products.category_id LEFT JOIN brands ON brands.id = products.brand_id WHERE products.name LIKE '%${search}%' AND category_id IN (${filter})ORDER BY id DESC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT products.*, categories.name as category, brands.name as brand FROM products LEFT JOIN categories ON categories.id = products.category_id LEFT JOIN brands ON brands.id = products.brand_id WHERE products.name LIKE '%${search}%' ORDER BY id DESC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        const productId = data[i].id 
        data[i].item_variants = []
        sql = `SELECT * FROM item_variants WHERE product_id=${productId}`
        const [variants] = await dbPool.execute(sql)
        // data[i].item_variants = variants
        for(let v = 0; v < variants.length; v++) {
            const variant = variants[v]
            data[i].item_variants.push({id: variant.id, product_id: variant.product_id, name: variant.name, sku: variant.sku, prices: [], cogs: variant.cogs, in_stock: variant.in_stock, stock_alert: variant.stock_alert})
            sql = `SELECT * FROM item_prices WHERE variant_id = ${variant.id}`
            const [itemPrices] = await dbPool.execute(sql)
            data[i].item_variants[v].prices = itemPrices
        }
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
const getDeatilProduct = async (body) => {
    const id = body
    let sql = `SELECT products.*, categories.name as category, brands.name as brand FROM products
    LEFT JOIN categories ON categories.id=products.category_id 
    LEFT JOIN brands ON brands.id = products.brand_id
    WHERE products.id= ${id}`
    const [data] = await dbPool.execute(sql);
    data[0].item_variants = []
    sql =`SELECT * FROM item_variants WHERE product_id=${id}`
    const [variant] = await dbPool.execute(sql)
    for (let i = 0; i < variant.length; i++) {
        variant[i].qty = 10;
    }
    data[0].item_variants = variant
    return data[0]
}
const importPorduct = async (body) => {
    let sql;
    let values;
    let category_id;
    let brand_id;
    let product_id;
    for(let i = 0; i < body.length; i++) {
        const el = body[i]
        sql = `SELECT * FROM categories WHERE name=?`
        values = [el.category]
        let [category] = await dbPool.execute(sql, values)
        if(category.length > 0) {
            category_id = category[0].id
        } else {
            sql = `INSERT INTO categories (name) VALUES (?)`
            values = [el.category]
            let [data] = await dbPool.execute(sql, values)
            category_id = data.insertId
        } 
        sql = `SELECT * FROM brands WHERE name = '${el.brand}'`
        values = [el.brand]
        let [brand] = await dbPool.execute(sql, values)
        if(brand.length > 0) {
            brand_id = brand[0].id
        } else {
            sql = `INSERT INTO brands (name) VALUES(?)`
            values = [el.brand]
            let [data] = await dbPool.execute(sql, values)
            brand_id = data.insertId
        }
        sql = `SELECT * FROM products WHERE name = ?`
        values = [el.name]
        let [product] = await dbPool.execute(sql, values)
        if(product.length > 0) {
            console.log('ready')
        } else {
            sql = `INSERT INTO products (name, category_id, brand_id) VALUES (?, ?, ?)`
            values = [el.name, category_id, brand_id]
            let [data] = await dbPool.execute(sql, values)
            product_id = data.insertId
            for(let i = 0; i < el.items.length; i++) {
                const item = el.items[i]
                let sku = await generateSku()
                try {
                    sql = `INSERT INTO item_variants (product_id, name, sku, price) VALUES (?, ?, ?, ?)`
                    values = [product_id, item.name, sku, item.price]
                    await dbPool.execute(sql, values)
                } catch (error) {
                    console.log(error)
                }
                
            }
        }
    }
    return
}
const insertProduct = async (body) => {
    const variants = body.item_variants
    let sql = `INSERT INTO products (
        name,
        brand_id,
        category_id,
        description, 
        image
    ) VALUES (?, ?, ?, ?, ?)`
    let values = [
        body.name,
        body.brand_id,
        body.category_id,
        body.description,
        body.image
    ]
    const [product] = await dbPool.execute(sql, values)
    const insertId = product.insertId
    values = []
    for (let i = 0; i < variants.length; i++) {
        const variant = variants[i]
        let sku = await generateSku()
        const sql = `INSERT INTO item_variants(
            product_id,
            name,
            sku,
            cogs,
            in_stock,
            stock_alert
        ) VALUES (?, ?, ?, ?, ?, ?)`
        let values = [
            insertId,
            variant.name,
            sku,
            variant.cogs,
            variant.in_stock,
            variant.stock_alert
        ]
        const [insertVariantId] = await dbPool.execute(sql, values)
        const variantId = insertVariantId.insertId
        const prices = variant.prices
        for(let i = 0; i < prices.length; i++) {
            const price = prices[i]
            const sql = `INSERT INTO item_prices(
                variant_id,
                branch_id,
                price
            ) VALUES (?, ?, ?)`
            let values = [
                variantId,
                price.branch_id,
                price.price
            ]
            await dbPool.execute(sql, values)
        }
    }
}

const updateProduct = async (body) => {
    const variants = body.item_variants
    let sql;
    if(body.image) {
        sql = `SELECT image FROM products WHERE id = ${body.id}`
        const [data] = await dbPool.execute(sql)
        const filePath = data[0].image
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
    sql =`UPDATE products SET name=?, brand_id=?, category_id=?, description=?, image=? WHERE id=?`
    let values = [
        body.name,
        body.brand_id,
        body.category_id,
        body.description,
        body.image,
        body.id
    ]
    await dbPool.execute(sql, values)
    for(let i=0; i < variants.length; i++) {
        const el = variants[i]
        const prices = el.prices
        if(el.id) {
            sql = `UPDATE item_variants SET name=?, cogs=?, stock_alert=? WHERE id=?`
            let values = [
                el.name,
                el.cogs,
                el.stock_alert,
                el.id
            ]
            await dbPool.execute(sql, values)
            for(let p = 0; p < prices.length; p++) {
                const el = prices[p]
                if(el.id) {
                    sql = `UPDATE item_prices SET price=? WHERE id=?`
                    let values = [
                        el.price,
                        el.id
                    ]
                    await dbPool.execute(sql, values)
                } else {
                    sql = `INSERT INTO item_prices(
                        variant_id,
                        branch_id,
                        price
                    ) VALUES (?, ?, ?)`
                    let values = [
                        el.variant_id,
                        el.branch_id,
                        el.price
                    ]
                    await dbPool.execute(sql, values)
                }
            }
        } else {
            let sku = await generateSku()
            sql = `INSERT INTO item_variants(
                product_id,
                name,
                sku,
                cogs,
                in_stock,
                stock_alert
            ) VALUES (?, ?, ?, ?, ?, ?)`
            let values = [
                body.id,
                el.name,
                sku,
                el.cogs,
                el.in_stock,
                el.stock_alert
            ]
            const [insertVariantId] = await dbPool.execute(sql, values)
            const variantId = insertVariantId.insertId
            for(let i = 0; i < prices.length; i++) {
                const price = prices[i]
                const sql = `INSERT INTO item_prices(
                    variant_id,
                    branch_id,
                    price
                ) VALUES (?, ?, ?)`
                let values = [
                    variantId,
                    price.branch_id,
                    price.price
                ]
                await dbPool.execute(sql, values)
            }

        }
    }
}

async function generateSku () {
    let sku;
    let sql = `SELECT sku FROM item_variants ORDER BY id DESC LIMIT 1`
    let [item] = await dbPool.execute(sql);
    if(item.length > 0) {
        let no = parseInt(item[0].sku)
        no++ 
        no = checkKode(no)
        function checkKode (i) {
            if(i < 10) {
                return `000${i}`
            }
            if(i < 100) {
                return `00${i}`
            }
            if(i < 1000) {
                return `0${i}`
            }
            if(i >= 1000) {
                return i
            } 
        }
        sku = no
    } else {
        sku = `0001`
    }
    return sku
}

module.exports = {
    getFilter,
    getAllProduct,
    getDeatilProduct,
    importPorduct,
    insertProduct,
    updateProduct,
}