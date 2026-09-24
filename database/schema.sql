-- =========================================================
-- Employee Leave Management System - MySQL Database Schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE,
    total_leave INT NOT NULL DEFAULT 20,
    used_leave INT NOT NULL DEFAULT 0,
    remaining_leave INT NOT NULL DEFAULT 20,
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =========================================================
-- Sample Seed Data
-- =========================================================

-- Insert Admin
INSERT INTO employees (employee_code, name, email, password, phone, department, designation, joining_date, total_leave, used_leave, remaining_leave, role)
VALUES ('EMP-001', 'System Admin', 'admin@gmail.com', 'admin123', '9876543210', 'Human Resources', 'HR Director', '2022-01-15', 20, 0, 20, 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Employees
INSERT INTO employees (employee_code, name, email, password, phone, department, designation, joining_date, total_leave, used_leave, remaining_leave, role)
VALUES 
('EMP-101', 'Abhishek Sharma', 'employee@gmail.com', 'employee123', '9812345678', 'Engineering', 'Senior Software Engineer', '2023-03-10', 20, 5, 15, 'EMPLOYEE'),
('EMP-102', 'Priya Patel', 'priya@gmail.com', 'priya123', '9823456789', 'Product Design', 'UI/UX Designer', '2023-06-01', 20, 2, 18, 'EMPLOYEE'),
('EMP-103', 'Rahul Verma', 'rahul@gmail.com', 'rahul123', '9834567890', 'Quality Assurance', 'QA Automation Engineer', '2024-01-10', 20, 0, 20, 'EMPLOYEE')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Sample Leave Requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, number_of_days, reason, status, rejection_reason, created_at)
VALUES 
(2, 'SICK', '2026-08-10', '2026-08-12', 3, 'Viral fever and recovery', 'APPROVED', NULL, NOW()),
(2, 'CASUAL', '2026-08-25', '2026-08-26', 2, 'Attending family wedding', 'APPROVED', NULL, NOW()),
(2, 'EARNED', '2026-10-05', '2026-10-08', 4, 'Vacation trip with family', 'PENDING', NULL, NOW()),
(3, 'CASUAL', '2026-07-14', '2026-07-15', 2, 'Personal work at hometown', 'APPROVED', NULL, NOW()),
(3, 'SICK', '2026-09-28', '2026-09-29', 2, 'Dental treatment', 'PENDING', NULL, NOW()),
(4, 'CASUAL', '2026-09-01', '2026-09-03', 3, 'Personal urgent matters', 'REJECTED', 'Sprint release deadline conflicts with requested dates.', NOW());
