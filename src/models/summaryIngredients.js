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
        sql = `SELECT ingredient_name FROM summary_ingredients
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND ingredient_name LIKE '%${search}%' AND branch_id IN ('${branch}')
        GROUP BY branch_id, ingredient_id`
    } else {
        sql = `SELECT ingredient_name FROM summary_ingredients
        WHERE (DATE(created_at) BETWEEN '${start}' AND '${end}') AND ingredient_name LIKE '%${search}%'
        GROUP BY branch_id, ingredient_id`
    }
    const [count] = await dbPool.execute(sql)
    totalItems = count.length
    
    if(filter) {
        let branch = filter.join("','")
        sql = `SELECT MIN(summary_ingredients.beginning) as beginning, summary_ingredients.branch_id as branch_id, summary_ingredients.ingredient_id as ingredient_id, summary_ingredients.ingredient_name as ingredient_name, branches.name as outlet_name, summary_ingredients.unit_name as unit_name, 
        SUM(summary_ingredients.purchase) as purchase,
        SUM(summary_ingredients.usages) as usages,
        SUM(summary_ingredients.transfer) as transfer,
        SUM(summary_ingredients.adjustment) as adjustment
        FROM summary_ingredients
        LEFT JOIN branches ON branches.id = summary_ingredients.branch_id 
        WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND summary_ingredients.ingredient_name LIKE '%${search}%' AND summary_ingredients.branch_id IN ('${branch}}')
        GROUP BY summary_ingredients.branch_id, summary_ingredients.ingredient_id 
        ORDER BY summary_ingredients.ingredient_name ASC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT MIN(summary_ingredients.beginning) as beginning, summary_ingredients.branch_id as branch_id, summary_ingredients.ingredient_id as ingredient_id, summary_ingredients.ingredient_name as ingredient_name, branches.name as outlet_name, summary_ingredients.unit_name as unit_name, 
        SUM(summary_ingredients.purchase) as purchase,
        SUM(summary_ingredients.usages) as usages,
        SUM(summary_ingredients.transfer) as transfer,
        SUM(summary_ingredients.adjustment) as adjustment
        FROM summary_ingredients
        LEFT JOIN branches ON branches.id = summary_ingredients.branch_id 
        WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND summary_ingredients.ingredient_name LIKE '%${search}%'
        GROUP BY summary_ingredients.branch_id, summary_ingredients.ingredient_id 
        ORDER BY summary_ingredients.ingredient_name ASC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
   
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        sql = `SELECT ending FROM summary_ingredients WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND branch_id='${data[i].branch_id}' AND ingredient_id='${data[i].ingredient_id}' ORDER BY id DESC LIMIT 1`
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
        sql = `SELECT MIN(summary_ingredients.beginning) as beginning, summary_ingredients.branch_id as branch_id, summary_ingredients.ingredient_id as ingredient_id, summary_ingredients.ingredient_name as ingredient_name, branches.name as outlet_name, summary_ingredients.unit_name as unit_name, 
        SUM(summary_ingredients.purchase) as purchase,
        SUM(summary_ingredients.usages) as usages,
        SUM(summary_ingredients.transfer) as transfer,
        SUM(summary_ingredients.adjustment) as adjustment
        FROM summary_ingredients
        LEFT JOIN branches ON branches.id = summary_ingredients.branch_id 
        WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND summary_ingredients.ingredient_name LIKE '%${search}%' AND summary_ingredients.branch_id IN ('${branch}}')
        GROUP BY summary_ingredients.branch_id, summary_ingredients.ingredient_id 
        ORDER BY summary_ingredients.ingredient_name ASC`
    } else {
        sql = `SELECT MIN(summary_ingredients.beginning) as beginning, summary_ingredients.branch_id as branch_id, summary_ingredients.ingredient_id as ingredient_id, summary_ingredients.ingredient_name as ingredient_name, branches.name as outlet_name, summary_ingredients.unit_name as unit_name, 
        SUM(summary_ingredients.purchase) as purchase,
        SUM(summary_ingredients.usages) as usages,
        SUM(summary_ingredients.transfer) as transfer,
        SUM(summary_ingredients.adjustment) as adjustment
        FROM summary_ingredients
        LEFT JOIN branches ON branches.id = summary_ingredients.branch_id 
        WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND summary_ingredients.ingredient_name LIKE '%${search}%'
        GROUP BY summary_ingredients.branch_id, summary_ingredients.ingredient_id 
        ORDER BY summary_ingredients.ingredient_name ASC`
    }
   
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        sql = `SELECT ending FROM summary_ingredients WHERE (DATE(summary_ingredients.created_at) BETWEEN '${start}' AND '${end}') AND branch_id='${data[i].branch_id}' AND ingredient_id='${data[i].ingredient_id}' ORDER BY id DESC LIMIT 1`
        const [ending] = await dbPool.execute(sql)
        data[i].ending = ending[0].ending
    }
    return data
}

module.exports = {
    getAllSummary,
    downloadSummary
}