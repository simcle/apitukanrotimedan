const dbPool = require('../config/database');

const countAteendenceSatatus = () => {
    const today = getDate(new Date())
    const sql = `SELECT 
                COUNT(IF(status='Masuk', 1, null)) as masuk,
                COUNT(IF(status='Tanpa keterangan', 1, null)) as tanpa_keterangan,
                COUNT(IF(status='Sakit', 1, null)) as sakit,
                COUNT(IF(status='Izin', 1, null)) as izin,
                COUNT(IF(status='Libur', 1, null)) as libur
                FROM attendences WHERE scan_date='${today}'
                `
    return dbPool.execute(sql)
}
const getAtttendenceByStatus = (body) => {
    const status = body
    const today = getDate(new Date())
    const sql = `SELECT attendences.*, users.name, users.role, branches.name as cabang FROM attendences 
    LEFT JOIN users ON attendences.user_id=users.id
    LEFT JOIN branches ON users.branch_id=branches.id WHERE attendences.scan_date='${today}' AND attendences.status='${status}'`

    return dbPool.execute(sql)
}

const getAttendences = (body) => {
    const scan_date = getDate(body.scan_date)
    let filter = body.filter
    let sql;
    if(filter) {
        filter = `'${filter.join("','")}'`
        sql = `SELECT users.id as user_id, users.branch_id, users.name, attendences.scan_date, attendences.time_in, attendences.time_out, 
        attendences.status, branches.name as cabang FROM users 
        LEFT JOIN branches ON users.branch_id=branches.id 
        LEFT JOIN attendences ON users.id=attendences.user_id 
        AND attendences.scan_date='${scan_date}' WHERE users.is_admin=false AND users.is_active=true AND users.branch_id IN (${filter}) ORDER BY -attendences.time_in DESC, status DESC`
        return dbPool.execute(sql)
    } else {
        sql = `SELECT users.id as user_id, users.branch_id, users.name, attendences.scan_date, attendences.time_in, attendences.time_out, 
        attendences.status, branches.name as cabang FROM users 
        LEFT JOIN branches ON users.branch_id=branches.id 
        LEFT JOIN attendences ON users.id=attendences.user_id 
        AND attendences.scan_date='${scan_date}' WHERE users.is_admin=false AND users.is_active=true ORDER BY -attendences.time_in DESC, status DESC`
        return dbPool.execute(sql)
    }
}

const updateAttendence = async (body) => {
    let sql;
    let date = new Date()
    let scan_date = getDate(date)

    sql =  `SELECT * FROM attendences WHERE user_id='${body.user_id}' AND scan_date = '${scan_date}'`
    const [user] = await dbPool.execute(sql)
    if(user.length == 0) {
        sql = `INSERT INTO attendences (user_id, status) VALUES('${body.user_id}', '${body.status}')`
        return dbPool.execute(sql)
    } else {
        sql = `UPDATE attendences SET status=? WHERE user_id=? AND scan_date=?`
        const values = [
            body.status,
            body.user_id,
            scan_date
        ] 
        return dbPool.execute(sql, values)
    }
}

const getReport = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let filter = body.filter
    let sql;
    let sql2;
    const start = getDate(body.start)
    const end = getDate(body.end)
    if(filter) {
        filter = `'${filter.join("','")}'`
        sql = `SELECT COUNT(attendences.id) as count FROM attendences LEFT JOIN users ON attendences.user_id=users.id WHERE (scan_date BETWEEN '${start}' AND '${end}') AND users.branch_id IN (${filter})`
    } else {
        sql = `SELECT COUNT(attendences.id) as count FROM attendences LEFT JOIN users ON attendences.user_id=users.id WHERE (scan_date BETWEEN '${start}' AND '${end}')`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 

    if(filter) {
        sql2 = `SELECT attendences.*, users.name, branches.name as cabang FROM attendences LEFT JOIN users ON attendences.user_id=users.id LEFT JOIN branches ON users.branch_id=branches.id WHERE (scan_date BETWEEN '${start}' AND '${end}') AND users.branch_id IN (${filter}) ORDER BY attendences.scan_date ASC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql2 = `SELECT attendences.*, users.name, branches.name as cabang FROM attendences LEFT JOIN users ON attendences.user_id=users.id LEFT JOIN branches ON users.branch_id=branches.id WHERE (scan_date BETWEEN '${start}' AND '${end}') ORDER BY attendences.scan_date ASC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql2)
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

const getUserAttendence = async (id, body) => {
    let currentPage = body.page || 1
    let perPage = body.perPage || 20
    let totalItems;
    let sql;
    const start = getDate(body.start)
    const end = getDate(body.end)
    sql = `SELECT COUNT(*) as count FROM attendences WHERE user_id='${id}' AND (scan_date BETWEEN '${start}' AND '${end}')`
    const [count] = await dbPool.execute(sql);
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    currentPage = (currentPage -1) * perPage
    sql = `SELECT * FROM attendences WHERE user_id='${id}' AND (scan_date BETWEEN '${start}' AND '${end}') ORDER BY attendences.scan_date ASC LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    const [data] = await dbPool.execute(sql);
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

const downloadReport =  (body) => {
    let filter = body.filter
    const start = getDate(body.start)
    const end = getDate(body.end)
    let sql;
    if(filter) {
        filter = `'${filter.join("','")}'`;
        sql = `SELECT attendences.*, DATE_FORMAT(attendences.scan_date, '%d/%m/%Y') as scan_date, users.name, branches.name as cabang FROM attendences LEFT JOIN users ON attendences.user_id=users.id LEFT JOIN branches ON users.branch_id=branches.id WHERE (scan_date BETWEEN '${start}' AND '${end}') AND users.branch_id IN (${filter}) ORDER BY attendences.scan_date ASC`
    } else {
        sql = `SELECT attendences.*, DATE_FORMAT(attendences.scan_date, '%d/%m/%Y') as scan_date, users.name, branches.name as cabang FROM attendences LEFT JOIN users ON attendences.user_id=users.id LEFT JOIN branches ON users.branch_id=branches.id WHERE (scan_date BETWEEN '${start}' AND '${end}') ORDER BY attendences.scan_date ASC`
    }
    return dbPool.execute(sql)
}

function getDate (i) {
    let date = new Date(i)
    let d = date.getDate()
    let m = date.getMonth() +1
    let y = date.getFullYear()
    d = checktime(d)
    m = checktime(m)
    function checktime (i) {
        if(i < 10) {
            return i = `0${i}`
        }
        return i
    }
    return`${y}-${m}-${d}`
}

module.exports = {
    countAteendenceSatatus,
    getAtttendenceByStatus,
    getAttendences,
    updateAttendence,
    getReport,
    getUserAttendence,
    downloadReport
}