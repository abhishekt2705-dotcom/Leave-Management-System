package com.example.leavemanagement.service;

import com.example.leavemanagement.dto.LeaveRequestDto;
import com.example.leavemanagement.dto.LeaveResponse;
import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.LeaveRequest;
import com.example.leavemanagement.entity.LeaveStatus;
import com.example.leavemanagement.entity.LeaveType;
import com.example.leavemanagement.entity.Role;
import com.example.leavemanagement.exception.InsufficientLeaveException;
import com.example.leavemanagement.exception.InvalidLeaveException;
import com.example.leavemanagement.exception.OverlappingLeaveException;
import com.example.leavemanagement.repository.EmployeeRepository;
import com.example.leavemanagement.repository.LeaveRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LeaveServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private LeaveService leaveService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = Employee.builder()
                .id(1L)
                .employeeCode("EMP-101")
                .name("Abhishek Sharma")
                .email("employee@gmail.com")
                .password("employee123")
                .department("Engineering")
                .totalLeave(20)
                .usedLeave(5)
                .remainingLeave(15)
                .role(Role.EMPLOYEE)
                .build();
    }

    @Test
    void testApplyLeave_Success() {
        LeaveRequestDto dto = LeaveRequestDto.builder()
                .employeeId(1L)
                .leaveType(LeaveType.CASUAL)
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 3))
                .reason("Personal work")
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.findOverlappingLeaves(any(), any(), any(), any())).thenReturn(Collections.emptyList());
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> {
            LeaveRequest req = i.getArgument(0);
            req.setId(10L);
            return req;
        });

        LeaveResponse response = leaveService.applyLeave(dto);

        assertNotNull(response);
        assertEquals(3, response.getNumberOfDays());
        assertEquals(LeaveStatus.PENDING, response.getStatus());
        // Remaining leave of employee should NOT change yet!
        assertEquals(15, employee.getRemainingLeave());
    }

    @Test
    void testApplyLeave_InvalidDateRange() {
        LeaveRequestDto dto = LeaveRequestDto.builder()
                .employeeId(1L)
                .leaveType(LeaveType.CASUAL)
                .startDate(LocalDate.of(2026, 10, 5))
                .endDate(LocalDate.of(2026, 10, 1))
                .reason("Invalid dates")
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThrows(InvalidLeaveException.class, () -> leaveService.applyLeave(dto));
    }

    @Test
    void testApplyLeave_InsufficientBalance() {
        // Employee has 15 remaining days, requests 20 days (e.g. 1st Oct to 20th Oct = 20 days)
        LeaveRequestDto dto = LeaveRequestDto.builder()
                .employeeId(1L)
                .leaveType(LeaveType.EARNED)
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 20))
                .reason("Long vacation")
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThrows(InsufficientLeaveException.class, () -> leaveService.applyLeave(dto));
    }

    @Test
    void testApplyLeave_OverlappingLeave() {
        LeaveRequestDto dto = LeaveRequestDto.builder()
                .employeeId(1L)
                .leaveType(LeaveType.SICK)
                .startDate(LocalDate.of(2026, 10, 2))
                .endDate(LocalDate.of(2026, 10, 4))
                .reason("Overlap test")
                .build();

        LeaveRequest existing = LeaveRequest.builder()
                .id(99L)
                .employee(employee)
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 5))
                .status(LeaveStatus.PENDING)
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.findOverlappingLeaves(any(), any(), any(), any())).thenReturn(List.of(existing));

        assertThrows(OverlappingLeaveException.class, () -> leaveService.applyLeave(dto));
    }

    @Test
    void testApproveLeave_Success_DeductsBalance() {
        LeaveRequest pendingLeave = LeaveRequest.builder()
                .id(20L)
                .employee(employee)
                .leaveType(LeaveType.CASUAL)
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 3))
                .numberOfDays(3)
                .status(LeaveStatus.PENDING)
                .build();

        when(leaveRequestRepository.findById(20L)).thenReturn(Optional.of(pendingLeave));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> i.getArgument(0));

        LeaveResponse response = leaveService.approveLeave(20L);

        assertEquals(LeaveStatus.APPROVED, response.getStatus());
        // Remaining leave should decrease from 15 to 12
        assertEquals(12, employee.getRemainingLeave());
        assertEquals(8, employee.getUsedLeave());
        verify(employeeRepository).save(employee);
    }

    @Test
    void testRejectLeave_Success_DoesNotDeductBalance() {
        LeaveRequest pendingLeave = LeaveRequest.builder()
                .id(21L)
                .employee(employee)
                .leaveType(LeaveType.CASUAL)
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 3))
                .numberOfDays(3)
                .status(LeaveStatus.PENDING)
                .build();

        when(leaveRequestRepository.findById(21L)).thenReturn(Optional.of(pendingLeave));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> i.getArgument(0));

        LeaveResponse response = leaveService.rejectLeave(21L, "Operational requirements");

        assertEquals(LeaveStatus.REJECTED, response.getStatus());
        assertEquals("Operational requirements", response.getRejectionReason());
        // Remaining leave should remain unchanged at 15
        assertEquals(15, employee.getRemainingLeave());
        assertEquals(5, employee.getUsedLeave());
        verify(employeeRepository, never()).save(employee);
    }
}
