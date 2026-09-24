package com.example.leavemanagement.service;

import com.example.leavemanagement.dto.LoginRequest;
import com.example.leavemanagement.dto.LoginResponse;
import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.exception.InvalidCredentialsException;
import com.example.leavemanagement.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public AuthService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!employee.getPassword().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return LoginResponse.builder()
                .message("Login successful")
                .role(employee.getRole())
                .employeeId(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .employeeCode(employee.getEmployeeCode())
                .department(employee.getDepartment())
                .build();
    }
}
