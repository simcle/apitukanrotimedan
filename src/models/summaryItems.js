const dbPool = require('../config/database');
const moment = require('moment');

const getAllSummary = async (body) => {
    const start = moment(body.start).format('YYYY-MM-DD')
    const end = moment(body.end).format('YYYY-MM-DD')
    const filter = body.filter
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let sql
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT item_name FROM summary_items
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND item_name LIKE '%${search}%' AND branch_id IN ('${branch}')
        GROUP BY branch_id, item_id`
    } else {
        sql = `SELECT item_name FROM summary_items
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND item_name LIKE '%${search}%'
        GROUP BY branch_id, item_id`
    }
    const [count] = await dbPool.execute(sql)
    totalItems = count.length

    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT MIN(summary_items.beginning) as beginning, summary_items.branch_id as branch_id, summary_items.item_id as item_id, summary_items.item_sku as sku, summary_items.item_name as item_name, branches.name as outlet_name, 
        SUM(summary_items.incoming) as incoming,
        SUM(summary_items.sales) as sales,
        SUM(summary_items.adjustment) as adjustment
        FROM summary_items
        LEFT JOIN branches ON branches.id = summary_items.branch_id 
        WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND summary_items.item_name LIKE '%${search}%' AND summary_items.branch_id IN ('${branch}}')
        GROUP BY summary_items.branch_id, summary_items.item_id 
        ORDER BY summary_items.item_name ASC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT MIN(summary_items.beginning) as beginning, summary_items.branch_id as branch_id, summary_items.item_id as item_id, summary_items.item_sku as sku, summary_items.item_name as item_name, branches.name as outlet_name, 
        SUM(summary_items.incoming) as incoming,
        SUM(summary_items.sales) as sales,
        SUM(summary_items.adjustment) as adjustment
        FROM summary_items
        LEFT JOIN branches ON branches.id = summary_items.branch_id 
        WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND summary_items.item_name LIKE '%${search}%'
        GROUP BY summary_items.branch_id, summary_items.item_id 
        ORDER BY summary_items.item_name ASC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }

    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        sql = `SELECT ending FROM summary_items WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND branch_id='${data[i].branch_id}' AND item_id='${data[i].item_id}' ORDER BY id DESC LIMIT 1`
        const [ending] = await dbPool.execute(sql)
        data[i].ending = ending[0].ending
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

const downloadSummary = async (body) => {
    const start = moment(body.start).format('YYYY-MM-DD')
    const end = moment(body.end).format('YYYY-MM-DD')
    const filter = body.filter
    let search = body.search
    let sql
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT MIN(summary_items.beginning) as beginning, summary_items.branch_id as branch_id, summary_items.item_id as item_id, summary_items.item_sku as sku, summary_items.item_name as item_name, branches.name as outlet_name, 
        IFNULL(SUM(summary_items.incoming), 0) as incoming,
        IFNULL(SUM(summary_items.sales), 0) as sales,
        IFNULL(SUM(summary_items.adjustment), 0) as adjustment
        FROM summary_items
        LEFT JOIN branches ON branches.id = summary_items.branch_id 
        WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND summary_items.item_name LIKE '%${search}%' AND summary_items.branch_id IN ('${branch}}')
        GROUP BY summary_items.branch_id, summary_items.item_id 
        ORDER BY summary_items.item_name ASC`
    } else {
        sql = `SELECT MIN(summary_items.beginning) as beginning, summary_items.branch_id as branch_id, summary_items.item_id as item_id, summary_items.item_sku as sku, summary_items.item_name as item_name, branches.name as outlet_name, 
        IFNULL(SUM(summary_items.incoming), 0) as incoming,
        IFNULL(SUM(summary_items.sales), 0) as sales,
        IFNULL(SUM(summary_items.adjustment), 0) as adjustment
        FROM summary_items
        LEFT JOIN branches ON branches.id = summary_items.branch_id 
        WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND summary_items.item_name LIKE '%${search}%'
        GROUP BY summary_items.branch_id, summary_items.item_id 
        ORDER BY summary_items.item_name ASC`
    }

    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        sql = `SELECT ending FROM summary_items WHERE (DATE(summary_items.created_at) BETWEEN '${start}' AND '${end}') AND branch_id='${data[i].branch_id}' AND item_id='${data[i].item_id}' ORDER BY id DESC LIMIT 1`
        const [ending] = await dbPool.execute(sql)
        data[i].ending = ending[0].ending
    }
    return data
}

module.exports = {
    getAllSummary,
    downloadSummary
}