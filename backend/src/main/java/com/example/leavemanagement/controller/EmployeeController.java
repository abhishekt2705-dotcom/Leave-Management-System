package com.example.leavemanagement.controller;

import com.example.leavemanagement.dto.CreateEmployeeDto;
import com.example.leavemanagement.dto.EmployeeResponse;
import com.example.leavemanagement.dto.LeaveBalanceResponse;
import com.example.leavemanagement.dto.LeaveResponse;
import com.example.leavemanagement.service.EmployeeService;
import com.example.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final LeaveService leaveService;

    @Autowired
    public EmployeeController(EmployeeService employeeService, LeaveService leaveService) {
        this.employeeService = employeeService;
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody CreateEmployeeDto createEmployeeDto) {
        EmployeeResponse response = employeeService.createEmployee(createEmployeeDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeProfile(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/{id}/leave-balance")
    public ResponseEntity<LeaveBalanceResponse> getLeaveBalance(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getLeaveBalance(id));
    }

    @GetMapping("/{id}/leaves")
    public ResponseEntity<List<LeaveResponse>> getEmployeeLeaveHistory(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployeeId(id));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }
}
