const dbPool = require('../config/database');
const moment = require('moment');
const getAllusers = () => {
    const sql = 'SELECT users.*, branches.name as merchant FROM users RIGHT JOIN branches ON branches.id=users.branch_id WHERE users.is_auth=true'
    
    return dbPool.execute(sql)
}
const getMe = (id) => {
    const sql = `SELECT id, name, email, role FROM users WHERE id='${id}'`
    return dbPool.execute(sql)
}
const registerUser = (body) => {
    const sql = `INSERT INTO users (name, email, password, role, is_auth, is_admin) VALUES(?, ?, ?, ?, ?, ?)`
    const values = [
        body.name,
        body.email,
        body.password,
        body.role,
        body.isAuth,
        body.isAdmin
    ]
    return dbPool.execute(sql, values)
}
const createUser = (data) => {
    const sql = `   INSERT INTO users (name, email, merchant_id, role)
                    VALUES ('${data.name}', '${data.email}', '${data.password}', '${data.merchantId}', '${data.role}')`
    return dbPool.execute(sql)
}
const updateUser = (data) => {
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE users SET name=?, email=?, merchant_id=?, role=?, updated_at=? WHERE id='${data.id}'`
    console.log(data)
    const values = [
        data.name,
        data.email,
        data.merchantId,
        data.role,
        updatedAt
    ]
    return dbPool.execute(sql, values)
}

const updatePassword = (data) => {
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE users SET password='${data.password}', is_auth=true, updated_at='${updatedAt}' WHERE id='${data.id}'`
    return dbPool.execute(sql)
}

const getUser = (email) => {
    const sql = `SELECT * FROM users WHERE email='${email}'`
    return dbPool.execute(sql)
}

const updateToken = (data) => {
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE users SET refresh_token='${data.refreshToken}', updated_at='${updatedAt}' WHERE id='${data.id}'`
    return dbPool.execute(sql)
} 

const refreshToken = (token) => {
    const sql = `SELECT * FROM users WHERE refresh_token='${token}'`
    return dbPool.execute(sql)
}
const deleteToken = (token) => {
    const sql = `UPDATE users SET refresh_token='' WHERE refresh_token='${token}'`
    return dbPool.execute(sql)
}
const lostPassword = (email) => {
    const sql = `SELECT * FROM users WHERE email='${email}' AND is_auth=true`
    return dbPool.execute(sql)
}


module.exports = {
    getMe,
    getAllusers,
    registerUser,
    createUser,
    updateUser,
    updatePassword,
    getUser,
    updateToken,
    refreshToken,
    deleteToken,
    lostPassword
}