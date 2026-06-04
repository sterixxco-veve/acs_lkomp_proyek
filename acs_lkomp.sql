CREATE DATABASE IF NOT EXISTS acs_lkomp;
USE acs_lkomp;

DROP USER IF EXISTS 'lkomp_admin'@'localhost';

CREATE USER 'lkomp_admin'@'localhost'
IDENTIFIED BY 'admin_password';

GRANT ALL PRIVILEGES
ON *.* TO 'lkomp_admin'@'localhost'
WITH GRANT OPTION;

FLUSH PRIVILEGES;

CREATE TABLE labs (
    lab_id INT PRIMARY KEY AUTO_INCREMENT,
    lab_code VARCHAR(10) UNIQUE,
    lab_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    total_pc INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE
);


CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role_id INT,
    lab_id INT,
    STATUS ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id),

    CONSTRAINT fk_user_lab
        FOREIGN KEY (lab_id)
        REFERENCES labs(lab_id)
);


CREATE TABLE documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,

    document_number VARCHAR(100) UNIQUE,

    purpose VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,

    requester_name VARCHAR(100) NOT NULL,
    requester_position VARCHAR(100),

    approver_name VARCHAR(100),
    approver_position VARCHAR(100),

    total_user INT DEFAULT 0,

    notes TEXT,

    STATUS ENUM(
        'Draft',
        'Pending',
        'Approved',
        'Rejected',
        'Completed'
    ) DEFAULT 'Draft',

    created_by INT,
    approved_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_creator
        FOREIGN KEY (created_by)
        REFERENCES users(user_id),

    CONSTRAINT fk_document_approver
        FOREIGN KEY (approved_by)
        REFERENCES users(user_id)
);


CREATE TABLE document_items (
    document_item_id INT PRIMARY KEY AUTO_INCREMENT,

    document_id INT NOT NULL,

    item_name VARCHAR(255) NOT NULL,

    quantity INT DEFAULT 1,

    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,

    revision_count INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_item_document
        FOREIGN KEY (document_id)
        REFERENCES documents(document_id)
        ON DELETE CASCADE
);



CREATE TABLE pcs (
    pc_id INT PRIMARY KEY AUTO_INCREMENT,
    pc_code VARCHAR(20) UNIQUE NOT NULL,
    lab_id INT,
    processor VARCHAR(100) NOT NULL,
    ram VARCHAR(50) NOT NULL,
    STORAGE VARCHAR(100) NOT NULL,
    gpu VARCHAR(100),
    STATUS ENUM('Usable','Maintenance','Broken') DEFAULT 'Usable',
    purchase_date DATE,
    last_maintenance DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pc_lab
        FOREIGN KEY (lab_id)
        REFERENCES labs(lab_id)
);


CREATE TABLE components (
    component_id INT PRIMARY KEY AUTO_INCREMENT,
    component_name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    TYPE ENUM(
        'RAM',
        'SSD',
        'HDD',
        'Motherboard',
        'CPU Fan',
        'PSU',
        'GPU',
        'Processor',
        'Other'
    ) NOT NULL,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    condition_status ENUM('New','Used','Refurbished') DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE component_stock_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    component_id INT,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,
    action_type ENUM('IN','OUT','ADJUSTMENT') NOT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_component
        FOREIGN KEY (component_id)
        REFERENCES components(component_id),

    CONSTRAINT fk_stock_user
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);

CREATE TABLE softwares (
    software_id INT PRIMARY KEY AUTO_INCREMENT,
    software_name VARCHAR(100) NOT NULL,
    VERSION VARCHAR(50),
    mata_kuliah VARCHAR(100),
    license_type ENUM('Free','Licensed') DEFAULT 'Free',
    license_expiry DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE software_lab_access (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT,
    lab_id INT,

    CONSTRAINT fk_access_software
        FOREIGN KEY (software_id)
        REFERENCES softwares(software_id),

    CONSTRAINT fk_access_lab
        FOREIGN KEY (lab_id)
        REFERENCES labs(lab_id)
);

CREATE TABLE pc_softwares (
    pc_software_id INT PRIMARY KEY AUTO_INCREMENT,
    pc_id INT,
    software_id INT,
    installed_date DATE,
    STATUS ENUM('Installed','Uninstalled') DEFAULT 'Installed',

    CONSTRAINT fk_pcsoftware_pc
        FOREIGN KEY (pc_id)
        REFERENCES pcs(pc_id),

    CONSTRAINT fk_pcsoftware_software
        FOREIGN KEY (software_id)
        REFERENCES softwares(software_id)
);


CREATE TABLE maintenance (
    maintenance_id INT PRIMARY KEY AUTO_INCREMENT,
    pc_id INT,
    complaint TEXT NOT NULL,
    maintenance_status ENUM('Pending','In Progress','Completed') DEFAULT 'Pending',
    handled_by INT,
    maintenance_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_date DATETIME,
    notes TEXT,

    CONSTRAINT fk_maintenance_pc
        FOREIGN KEY (pc_id)
        REFERENCES pcs(pc_id),

    CONSTRAINT fk_maintenance_user
        FOREIGN KEY (handled_by)
        REFERENCES users(user_id)
);

CREATE TABLE maintenance_details (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    maintenance_id INT,
    component_id INT,
    quantity INT DEFAULT 1,

    CONSTRAINT fk_detail_maintenance
        FOREIGN KEY (maintenance_id)
        REFERENCES maintenance(maintenance_id),

    CONSTRAINT fk_detail_component
        FOREIGN KEY (component_id)
        REFERENCES components(component_id)
);

DELIMITER $$

CREATE FUNCTION fn_total_pc_by_lab(p_lab_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total_pc INT;

    SELECT COUNT(*)
    INTO total_pc
    FROM pcs
    WHERE lab_id = p_lab_id;

    RETURN total_pc;
END $$

DELIMITER ;


DELIMITER $$

CREATE FUNCTION fn_low_stock(p_component_id INT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE current_stock INT;
    DECLARE minimum_stock INT;

    SELECT stock, min_stock
    INTO current_stock, minimum_stock
    FROM components
    WHERE component_id = p_component_id;

    IF current_stock <= minimum_stock THEN
        RETURN 'LOW STOCK';
    ELSE
        RETURN 'SAFE';
    END IF;
END $$

DELIMITER ;


DELIMITER $$

CREATE FUNCTION fn_license_status(expiry_date DATE)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF expiry_date >= CURDATE() THEN
        RETURN 'ACTIVE';
    ELSE
        RETURN 'EXPIRED';
    END IF;
END $$

DELIMITER ;


DELIMITER $$

CREATE FUNCTION fn_user_role(p_user_id INT)
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE role_name VARCHAR(50);

    SELECT r.role_name
    INTO role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = p_user_id;

    RETURN role_name;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_add_pc (
    IN p_pc_code VARCHAR(20),
    IN p_lab_id INT,
    IN p_processor VARCHAR(100),
    IN p_ram VARCHAR(50),
    IN p_storage VARCHAR(100),
    IN p_gpu VARCHAR(100)
)
BEGIN
    INSERT INTO pcs(
        pc_code,
        lab_id,
        processor,
        ram,
        STORAGE,
        gpu
    )
    VALUES(
        p_pc_code,
        p_lab_id,
        p_processor,
        p_ram,
        p_storage,
        p_gpu
    );
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_update_component_stock (
    IN p_component_id INT,
    IN p_qty INT,
    IN p_action VARCHAR(20)
)
BEGIN
    DECLARE current_stock INT;

    SELECT stock
    INTO current_stock
    FROM components
    WHERE component_id = p_component_id;

    IF p_action = 'IN' THEN
        UPDATE components
        SET stock = stock + p_qty
        WHERE component_id = p_component_id;
    ELSE
        UPDATE components
        SET stock = stock - p_qty
        WHERE component_id = p_component_id;
    END IF;

    INSERT INTO component_stock_logs(
        component_id,
        stock_before,
        stock_after,
        action_type
    )
    VALUES(
        p_component_id,
        current_stock,
        (SELECT stock FROM components WHERE component_id = p_component_id),
        p_action
    );
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_finish_maintenance (
    IN p_maintenance_id INT
)
BEGIN
    UPDATE maintenance
    SET maintenance_status = 'Completed',
        completed_date = NOW()
    WHERE maintenance_id = p_maintenance_id;

    UPDATE pcs
    SET STATUS = 'Usable',
        last_maintenance = CURDATE()
    WHERE pc_id = (
        SELECT pc_id
        FROM maintenance
        WHERE maintenance_id = p_maintenance_id
    );
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_reduce_stock
AFTER INSERT ON maintenance_details
FOR EACH ROW
BEGIN
    UPDATE components
    SET stock = stock - NEW.quantity
    WHERE component_id = NEW.component_id;
END $$

DELIMITER ;


CREATE VIEW vw_health_status_per_lab AS
SELECT 
    l.lab_name,
    SUM(CASE WHEN p.status = 'Usable' THEN 1 ELSE 0 END) AS usable_pc,
    SUM(CASE WHEN p.status = 'Broken' THEN 1 ELSE 0 END) AS broken_pc,
    SUM(CASE WHEN p.status = 'Maintenance' THEN 1 ELSE 0 END) AS maintenance_pc
FROM pcs p
JOIN labs l ON p.lab_id = l.lab_id
GROUP BY l.lab_name;


CREATE VIEW vw_low_stock_alert AS
SELECT 
    component_name,
    stock,
    min_stock,
    CASE
        WHEN stock <= min_stock THEN 'Critical'
        ELSE 'Safe'
    END AS STATUS
FROM components;


CREATE VIEW vw_maintenance_trend AS
SELECT 
    MONTH(maintenance_date) AS month_num,
    COUNT(*) AS total_maintenance
FROM maintenance
GROUP BY MONTH(maintenance_date);


CREATE VIEW vw_dashboard_summary AS
SELECT
    COUNT(*) AS total_pc,
    SUM(CASE WHEN STATUS = 'Usable' THEN 1 ELSE 0 END) AS active_pc,
    SUM(CASE WHEN STATUS = 'Broken' THEN 1 ELSE 0 END) AS broken_pc,
    SUM(CASE WHEN STATUS = 'Maintenance' THEN 1 ELSE 0 END) AS maintenance_pc
FROM pcs;


CREATE VIEW vw_live_activity AS
SELECT
    m.maintenance_id,
    p.pc_code,
    m.maintenance_status,
    m.maintenance_date,
    m.completed_date
FROM maintenance m
JOIN pcs p ON m.pc_id = p.pc_id
ORDER BY m.maintenance_date DESC;


INSERT INTO roles(role_name)
VALUES
('Admin L4'),
('Admin L3'),
('Admin L2'),
('Admin E4'),
('SuperAdmin'),
('Sekretaris');

INSERT INTO labs(lab_code, lab_name, location)
VALUES
('L4', 'Lab L4', 'Building L Floor 4'),
('L3', 'Lab L3', 'Building L Floor 3'),
('L2', 'Lab L2', 'Building L Floor 2'),
('E4', 'Lab E4', 'Building E Floor 4');

INSERT INTO users (
    username,
    PASSWORD,
    full_name,
    role_id,
    lab_id,
    STATUS
)
VALUES (
    'admin_l4',
    'dummyhash',
    'Admin Lab L4',
    1,
    1,
    'Active'
);

INSERT INTO documents (
    purpose,
    event_name,
    requester_name,
    requester_position,
    approver_name,
    approver_position,
    total_user
)
VALUES (
    'Peminjaman Fasilitas Laboratorium ISTTS',
    'Acara XYZ',
    'Budi Santoso',
    'Ketua',
    'Ir. Indah Andih, S.Kom., M.Kom.',
    'Manager XYZ',
    40
);


INSERT INTO document_items (
    document_id,
    item_name,
    quantity,
    start_time,
    end_time,
    revision_count
)
VALUES (
    1,
    'Monitor Lab L-204',
    5,
    '2025-03-28 08:30:00',
    '2025-03-28 13:30:00',
    0
);


