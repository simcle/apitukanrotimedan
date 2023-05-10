const dbPool = require('../config/database');


const migrate = async () => {
    const users = `CREATE TABLE IF NOT EXISTS users(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        mobile_phone VARCHAR(255),
        password VARCHAR(255),
        refresh_token VARCHAR(255),
        reset_password VARCHAR(255),
        branch_id INT,
        is_admin BOOLEAN DEFAULT false,
        is_auth BOOLEAN DEFAULT false,
        role VARCHAR(255),
        status_pekerjaan VARCHAR(255),
        gaji_pokok INT,
        tanggal_bergabung DATE,
        tanggal_keluar DATE,
        nik_ktp VARCHAR(255),
        tempat_lahir VARCHAR(255),
        tanggal_lahir DATE,
        jenis_kelamin VARCHAR(255),
        status_pernikahan VARCHAR(255),
        golongan_darah VARCHAR(255),
        agama VARCHAR(255),
        alamat VARCHAR(255),
        template VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (email)
    )`
    await dbPool.execute(users)
    
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

    const branches = `CREATE TABLE IF NOT EXISTS branches(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),
        mobile VARCHAR(255),
        cloud_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(branches)
}

module.exports = migrate
