const dbPool = require('../config/database');

const getAllProvinces = () => {
    const sql = `SELECT * FROM provinces`
    return dbPool.execute(sql);
}

const getCities = (id) => {
    const sql = `SELECT * FROM regencies WHERE province_id='${id}'`
    return dbPool.execute(sql)
}
const getSubdistricts = (id) => {
    const sql = `SELECT * FROM districts WHERE regency_id='${id}'`
    return dbPool.execute(sql)
}
module.exports = {
    getAllProvinces,
    getCities,
    getSubdistricts
}