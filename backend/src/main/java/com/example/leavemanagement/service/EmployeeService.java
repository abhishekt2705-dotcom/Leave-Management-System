package com.example.leavemanagement.service;

import com.example.leavemanagement.dto.CreateEmployeeDto;
import com.example.leavemanagement.dto.EmployeeResponse;
import com.example.leavemanagement.dto.LeaveBalanceResponse;
import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.LeaveStatus;
import com.example.leavemanagement.exception.InvalidLeaveException;
import com.example.leavemanagement.exception.ResourceNotFoundException;
import com.example.leavemanagement.repository.EmployeeRepository;
import com.example.leavemanagement.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, LeaveRequestRepository leaveRequestRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = getEmployeeEntity(id);
        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeDto dto) {
        if (employeeRepository.existsByEmail(dto.getEmail().trim().toLowerCase())) {
            throw new InvalidLeaveException("An employee with email " + dto.getEmail() + " already exists.");
        }

        long nextIndex = employeeRepository.count() + 101;
        String generatedCode = "EMP-" + nextIndex;

        int total = dto.getTotalLeave() != null && dto.getTotalLeave() > 0 ? dto.getTotalLeave() : 20;

        Employee employee = Employee.builder()
                .employeeCode(generatedCode)
                .name(dto.getName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .password(dto.getPassword().trim())
                .phone(dto.getPhone() != null ? dto.getPhone().trim() : null)
                .department(dto.getDepartment() != null ? dto.getDepartment().trim() : "General")
                .designation(dto.getDesignation() != null ? dto.getDesignation().trim() : "Staff")
                .joiningDate(dto.getJoiningDate() != null ? dto.getJoiningDate() : LocalDate.now())
                .totalLeave(total)
                .usedLeave(0)
                .remainingLeave(total)
                .role(dto.getRole() != null ? dto.getRole() : com.example.leavemanagement.entity.Role.EMPLOYEE)
                .build();

        Employee saved = employeeRepository.save(employee);
        return EmployeeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public LeaveBalanceResponse getLeaveBalance(Long id) {
        Employee employee = getEmployeeEntity(id);
        long pendingCount = leaveRequestRepository.findByEmployee_IdOrderByCreatedAtDesc(id).stream()
                .filter(l -> l.getStatus() == LeaveStatus.PENDING)
                .count();

        return LeaveBalanceResponse.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .employeeCode(employee.getEmployeeCode())
                .totalLeave(employee.getTotalLeave())
                .usedLeave(employee.getUsedLeave())
                .remainingLeave(employee.getRemainingLeave())
                .pendingRequestsCount(pendingCount)
                .build();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeEntity(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }
}
