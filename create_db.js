const mysql = require('mysql2/promise');

async function createDatabaseAndTables() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'bankir',
        password: 'pass123',
    });

    await connection.query('DROP DATABASE IF EXISTS BankEl');
    await connection.query('CREATE DATABASE BankEl');
    await connection.changeUser({ database: 'BankEl' });

    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS private_individuals (
                id INT NOT NULL AUTO_INCREMENT,
                first_name VARCHAR(45) NULL,
                second_name VARCHAR(45) NULL,
                sername VARCHAR(45) NULL,
                passport VARCHAR(45) NULL,
                inn VARCHAR(45) NULL,
                snils VARCHAR(45) NULL,
                license VARCHAR(45) NULL,
                docs VARCHAR(255) NULL,
                notes VARCHAR(255) NULL,
                PRIMARY KEY (id)
            ) ENGINE = InnoDB;
        `);
        await connection.query(`
        CREATE TABLE IF NOT EXISTS borrowers (
            id INT NOT NULL,
            inn VARCHAR(45) NULL,
            borrower_type TINYINT NULL,
            address VARCHAR(255) NULL,
            amount DECIMAL(15,2) NULL,
            conditions VARCHAR(255) NULL,
            juridical_notes VARCHAR(255) NULL,
            contracts_list VARCHAR(255) NULL,
            PRIMARY KEY (id)
        ) ENGINE = InnoDB;
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS borrowed_funds (
            id INT NOT NULL,
            indvidual_id INT NULL,
            amount DECIMAL(15,2) NULL,
            interest_rate DECIMAL(5,2) NULL,
            bid DECIMAL(5,2) NULL,
            borrow_date DATETIME NULL,
            conditions VARCHAR(255) NULL,
            notes VARCHAR(45) NULL,
            borrower_id INT NULL,
            PRIMARY KEY (id),
            INDEX indvidual_id_idx (indvidual_id ASC) VISIBLE,
            INDEX borrower_id_idx (borrower_id ASC) VISIBLE,
            CONSTRAINT indvidual_id
                FOREIGN KEY (indvidual_id)
                REFERENCES private_individuals (id)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION,
            CONSTRAINT borrower_id
                FOREIGN KEY (borrower_id)
                REFERENCES borrowers (id)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB;
        `)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS organization_loans (
            id INT NOT NULL,
            ogranization_id INT NULL,
            individual_id INT NULL,
            amount DECIMAL(15,2) NULL,
            loan_date DATETIME NULL,
            interest_rate DECIMAL(5,2) NULL,
            conditions VARCHAR(255) NULL,
            notes VARCHAR(255) NULL,
            PRIMARY KEY (id),
            INDEX individual_id_idx (individual_id ASC) VISIBLE,
            CONSTRAINT individual_id
                FOREIGN KEY (individual_id)
                REFERENCES private_individuals (id)
                ON DELETE NO ACTION
                ON UPDATE NO ACTION)
            ENGINE = InnoDB;
        `);
        console.log("Создание таблиц.");
    } catch (error) {
        console.error("Ошибка создания таблиц:", error);
    }

    await connection.end();
}

createDatabaseAndTables().catch(error => {
    console.error('Ошибка создания базы', error);
});