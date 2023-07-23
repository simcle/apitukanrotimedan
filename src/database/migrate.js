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

    const cusotmers = `CREATE TABLE IF NOT EXISTS customers(
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20),
        name VARCHAR(255),
        telepon VARCHAR(18),
        alamat VARCHAR(255),
        catatan VARCHAR(255),
        branch_id INT,
        user_id INT
    ) ENGINE=INNODB`
    await dbPool.execute(cusotmers)

    const sales = `CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_no VARCHAR(255),
        customer_id INT DEFAULT NULL,
        customer VARCHAR(255),
        total INT,
        payment_method VARCHAR(255),
        payment_amount INT DEFAULT NULL,
        bank_id INT DEFAULT NULL,
        change_amount INT DEFAULT NULL,
        status VARCHAR(255),
        branch_id INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=INNODB`
    await dbPool.execute(sales)

    const sale_details = `CREATE TABLE IF NOT EXISTS sales_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_id INT,
        variant_id INT,
        cogs INT DEFAULT NULL,
        price INT,
        qty INT,
        total INT
    ) ENGINE=INNODB`
    await dbPool.execute(sale_details)

    const payment_methods = `CREATE TABLE IF NOT EXISTS payment_methods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(255),
        provider VARCHAR(255),
        status BOOLEAN DEFAULT true
    ) ENGINE=INNODB`
    await dbPool.execute(payment_methods); 
}

module.exports = migrate
