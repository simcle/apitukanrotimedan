const dbPool = require('../config/database');


const migrate = async () => {
    const companies = `CREATE TABLE IF NOT EXISTS companies(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        tagline VARCHAR(255),
        description VARCHAR(255),
        address VARCHAR(255),
        province_id INT,
        city_id INT,
        subdistrict_id INT,
        postal_code VARCHAR(20),
        phone VARCHAR(255),
        fax VARCHAR(255),
        email VARCHAR(255),
        website VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(companies)

    const merchants = `CREATE TABLE IF NOT EXISTS merchants(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),
        mobile VARCHAR(255),
        cloud_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(merchants)

    const employees = `CREATE TABLE IF NOT EXISTS employees(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        nik VARCHAR(255),
        tempat_lahir VARCHAR(255),
        tanggal_lahir DATE,
        jenis_kelamin VARCHAR(255),
        status_pernikahan VARCHAR(255),
        golongan_darah VARCHAR(255),
        agama VARCHAR(255),
        alamat VARCHAR(255),
        mobile_phone VARCHAR(255),
        email VARCHAR(255),
        posisi_pekerjaan VARCHAR(255),
        merchant_id INT NOT NULL,
        status_pekerjaan VARCHAR(255),
        tanggal_bergabung DATE,
        gaji_pokok INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(employees)
}

module.exports = migrate
