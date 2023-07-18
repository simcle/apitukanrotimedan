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
        is_active BOOLEAN DEFAULT true,
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
        template LONGTEXT,
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

    const attendences = `CREATE TABLE IF NOT EXISTS attendences(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        time_in TIME,
        time_out TIME,
        scan_date DATE DEFAULT CURRENT_TIMESTAMP,
        status_scan INT,
        status VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(attendences)

    const categories = `CREATE TABLE IF NOT EXISTS categories(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR (255),
        description VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(categories)

    const brands = `CREATE TABLE IF NOT EXISTS brands(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR (255),
        description VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(brands)

    const products = `CREATE TABLE IF NOT EXISTS products(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        brand_id INT DEFAULT NULL,
        category_id INT DEFAULT NULL,
        description LONGTEXT DEFAULT NULL,
        image VARCHAR(255)
    ) ENGINE=INNODB`
    await dbPool.execute(products)

    const item_variants = `CREATE TABLE IF NOT EXISTS item_variants(
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        name VARCHAR(255),
        sku VARCHAR(255),
        price INT DEFAULT 0,
        cogs INT DEFAULT 0,
        in_stock INT DEFAULT NULL,
        stock_alert INT DEFAULT NULL
    ) ENGINE=INNODB`
    await dbPool.execute(item_variants)
}

module.exports = migrate
