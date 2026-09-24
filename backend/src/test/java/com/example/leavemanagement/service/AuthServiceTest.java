package com.example.leavemanagement.service;

import com.example.leavemanagement.dto.LoginRequest;
import com.example.leavemanagement.dto.LoginResponse;
import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.Role;
import com.example.leavemanagement.exception.InvalidCredentialsException;
import com.example.leavemanagement.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void testLogin_Success() {
        Employee emp = Employee.builder()
                .id(1L)
                .name("Abhishek")
                .email("employee@gmail.com")
                .password("employee123")
                .role(Role.EMPLOYEE)
                .build();

        when(employeeRepository.findByEmail("employee@gmail.com")).thenReturn(Optional.of(emp));

        LoginResponse response = authService.login(new LoginRequest("employee@gmail.com", "employee123"));

        assertNotNull(response);
        assertEquals("Login successful", response.getMessage());
        assertEquals(Role.EMPLOYEE, response.getRole());
        assertEquals(1L, response.getEmployeeId());
    }

    @Test
    void testLogin_InvalidPassword() {
        Employee emp = Employee.builder()
                .id(1L)
                .email("employee@gmail.com")
                .password("employee123")
                .build();

        when(employeeRepository.findByEmail("employee@gmail.com")).thenReturn(Optional.of(emp));

        assertThrows(InvalidCredentialsException.class, () ->
                authService.login(new LoginRequest("employee@gmail.com", "wrongpassword")));
    }
}
