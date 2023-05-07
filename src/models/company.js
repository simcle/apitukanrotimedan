const dbPool = require('../config/database');
const moment = require('moment')
const getCompany = () => {
    const sql = `   SELECT companies.*, provinces.name as province, regencies.name as city, districts.name as disctrict FROM companies 
                    LEFT JOIN provinces ON companies.province_id = provinces.id
                    LEFT JOIN regencies ON companies.city_id = regencies.id
                    LEFT JOIN districts ON companies.subdistrict_id = districts.id`
    return dbPool.execute(sql)
}

const insertCompany = (body) => {
    const sql = `INSERT INTO companies (name, tagline, description, address, province_id, city_id, subdistrict_id, postal_code, phone, fax, email, website) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`
    const values = [
        body.name,
        body.tagline,
        body.description,
        body.address,
        body.provinceId,
        body.cityId,
        body.subdistrictId,
        body.postalCode,
        body.phone,
        body.fax,
        body.email,
        body.website
    ]
    return dbPool.execute(sql, values)
}

const updateCompany = (body) => {
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE companies SET name=?, tagline=?, description=?, address=?, province_id=?, city_id=?, subdistrict_id=?, postal_code=?, phone=?, fax=?, email=?, website=?, updated_at=?`
    const values = [
        body.name,
        body.tagline,
        body.description,
        body.address,
        body.provinceId,
        body.cityId,
        body.subdistrictId,
        body.postalCode,
        body.phone,
        body.fax,
        body.email,
        body.website,
        updatedAt
    ]
    return dbPool.execute(sql, values)
}
module.exports = {
    getCompany,
    insertCompany,
    updateCompany
}