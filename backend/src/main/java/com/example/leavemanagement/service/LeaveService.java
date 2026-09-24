package com.example.leavemanagement.service;

import com.example.leavemanagement.dto.AdminDashboardStats;
import com.example.leavemanagement.dto.LeaveRequestDto;
import com.example.leavemanagement.dto.LeaveResponse;
import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.LeaveRequest;
import com.example.leavemanagement.entity.LeaveStatus;
import com.example.leavemanagement.entity.Role;
import com.example.leavemanagement.exception.InsufficientLeaveException;
import com.example.leavemanagement.exception.InvalidLeaveException;
import com.example.leavemanagement.exception.OverlappingLeaveException;
import com.example.leavemanagement.exception.ResourceNotFoundException;
import com.example.leavemanagement.repository.EmployeeRepository;
import com.example.leavemanagement.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public LeaveService(LeaveRequestRepository leaveRequestRepository, EmployeeRepository employeeRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public LeaveResponse applyLeave(LeaveRequestDto dto) {
        // 1. Validate employee exists
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));

        // 2. Validate dates
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new InvalidLeaveException("Start date and End date are required.");
        }

        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new InvalidLeaveException("Invalid leave date range. Start date cannot be after end date.");
        }

        // 3. Calculate number of days (inclusive)
        int requestedDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        // 4. Validate leave balance
        if (employee.getRemainingLeave() < requestedDays) {
            throw new InsufficientLeaveException(
                    "Insufficient leave balance. Requested: " + requestedDays + " days, Remaining: " + employee.getRemainingLeave() + " days."
            );
        }

        // 5. Validate overlapping leaves (with PENDING or APPROVED statuses)
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingLeaves(
                employee.getId(),
                dto.getStartDate(),
                dto.getEndDate(),
                Arrays.asList(LeaveStatus.PENDING, LeaveStatus.APPROVED)
        );

        if (!overlapping.isEmpty()) {
            LeaveRequest conflict = overlapping.get(0);
            throw new OverlappingLeaveException(
                    "Leave request overlaps with an existing " + conflict.getStatus() +
                    " leave request from " + conflict.getStartDate() + " to " + conflict.getEndDate() + "."
            );
        }

        // 6. Create leave request
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(dto.getLeaveType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .numberOfDays(requestedDays)
                .reason(dto.getReason().trim())
                .status(LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return LeaveResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaveRequests() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeavesByEmployeeId(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }

        return leaveRequestRepository.findByEmployee_IdOrderByCreatedAtDesc(employeeId).stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new InvalidLeaveException("Only pending leave requests can be approved. Current status: " + leave.getStatus());
        }

        Employee employee = leave.getEmployee();
        int days = leave.getNumberOfDays();

        // Re-verify leave balance at the time of approval
        if (employee.getRemainingLeave() < days) {
            throw new InsufficientLeaveException(
                    "Cannot approve leave. Employee has insufficient remaining balance (" +
                    employee.getRemainingLeave() + " days remaining, request requires " + days + " days)."
            );
        }

        // Deduct from employee balance
        employee.setUsedLeave(employee.getUsedLeave() + days);
        employee.setRemainingLeave(employee.getRemainingLeave() - days);
        employeeRepository.save(employee);

        // Update leave status
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setRejectionReason(null);
        LeaveRequest updated = leaveRequestRepository.save(leave);

        return LeaveResponse.fromEntity(updated);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, String rejectionReason) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new InvalidLeaveException("Only pending leave requests can be rejected. Current status: " + leave.getStatus());
        }

        leave.setStatus(LeaveStatus.REJECTED);
        if (rejectionReason != null && !rejectionReason.trim().isEmpty()) {
            leave.setRejectionReason(rejectionReason.trim());
        }
        LeaveRequest updated = leaveRequestRepository.save(leave);

        return LeaveResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public AdminDashboardStats getDashboardStats() {
        long totalEmployees = employeeRepository.countByRole(Role.EMPLOYEE);
        long pending = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);
        long approved = leaveRequestRepository.countByStatus(LeaveStatus.APPROVED);
        long rejected = leaveRequestRepository.countByStatus(LeaveStatus.REJECTED);
        long total = pending + approved + rejected;

        return AdminDashboardStats.builder()
                .totalEmployees(totalEmployees)
                .pendingRequests(pending)
                .approvedRequests(approved)
                .rejectedRequests(rejected)
                .totalRequests(total)
                .build();
    }
}
