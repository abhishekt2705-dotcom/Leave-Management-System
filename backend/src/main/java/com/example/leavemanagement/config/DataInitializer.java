package com.example.leavemanagement.config;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.Role;
import com.example.leavemanagement.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final EmployeeRepository employeeRepository;

    @Autowired
    public DataInitializer(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        if (employeeRepository.count() == 0) {
            log.info("Initializing clean system accounts...");

            // 1. Admin Account
            Employee admin = Employee.builder()
                    .employeeCode("ADM-001")
                    .name("System Admin")
                    .email("admin@gmail.com")
                    .password("admin123")
                    .phone("9876543210")
                    .department("Administration")
                    .designation("HR Administrator")
                    .joiningDate(LocalDate.now())
                    .totalLeave(20)
                    .usedLeave(0)
                    .remainingLeave(20)
                    .role(Role.ADMIN)
                    .build();

            // 2. Default Employee Account (Fresh, 0 leaves used)
            Employee emp = Employee.builder()
                    .employeeCode("EMP-101")
                    .name("Abhishek Sharma")
                    .email("employee@gmail.com")
                    .password("employee123")
                    .phone("9812345678")
                    .department("Engineering")
                    .designation("Software Engineer")
                    .joiningDate(LocalDate.now())
                    .totalLeave(20)
                    .usedLeave(0)
                    .remainingLeave(20)
                    .role(Role.EMPLOYEE)
                    .build();

            employeeRepository.saveAll(Arrays.asList(admin, emp));
            log.info("System initialized with clean admin and employee accounts. 0 leave requests.");
        }
    }
}
