package com.example.leavemanagement.controller;

import com.example.leavemanagement.dto.AdminDashboardStats;
import com.example.leavemanagement.dto.LeaveRequestDto;
import com.example.leavemanagement.dto.LeaveResponse;
import com.example.leavemanagement.dto.RejectRequestDto;
import com.example.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    @Autowired
    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> applyLeave(@Valid @RequestBody LeaveRequestDto leaveRequestDto) {
        LeaveResponse response = leaveService.applyLeave(leaveRequestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponse>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveService.getAllLeaveRequests());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponse>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployeeId(employeeId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveResponse> approveLeave(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.approveLeave(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveResponse> rejectLeave(
            @PathVariable Long id,
            @RequestBody(required = false) RejectRequestDto rejectRequestDto) {
        String reason = rejectRequestDto != null ? rejectRequestDto.getRejectionReason() : null;
        return ResponseEntity.ok(leaveService.rejectLeave(id, reason));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(leaveService.getDashboardStats());
    }
}
