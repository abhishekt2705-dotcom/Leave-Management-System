package com.example.leavemanagement.dto;

import com.example.leavemanagement.entity.Employee;
import com.example.leavemanagement.entity.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private Integer totalLeave;
    private Integer usedLeave;
    private Integer remainingLeave;
    private Role role;
    private LocalDateTime createdAt;

    public EmployeeResponse() {}

    public EmployeeResponse(Long id, String employeeCode, String name, String email, String phone,
                            String department, String designation, LocalDate joiningDate,
                            Integer totalLeave, Integer usedLeave, Integer remainingLeave,
                            Role role, LocalDateTime createdAt) {
        this.id = id;
        this.employeeCode = employeeCode;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.totalLeave = totalLeave;
        this.usedLeave = usedLeave;
        this.remainingLeave = remainingLeave;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String employeeCode;
        private String name;
        private String email;
        private String phone;
        private String department;
        private String designation;
        private LocalDate joiningDate;
        private Integer totalLeave;
        private Integer usedLeave;
        private Integer remainingLeave;
        private Role role;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public Builder totalLeave(Integer totalLeave) { this.totalLeave = totalLeave; return this; }
        public Builder usedLeave(Integer usedLeave) { this.usedLeave = usedLeave; return this; }
        public Builder remainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public EmployeeResponse build() {
            return new EmployeeResponse(id, employeeCode, name, email, phone, department, designation, joiningDate, totalLeave, usedLeave, remainingLeave, role, createdAt);
        }
    }

    public static EmployeeResponse fromEntity(Employee employee) {
        if (employee == null) return null;
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .name(employee.getName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .joiningDate(employee.getJoiningDate())
                .totalLeave(employee.getTotalLeave())
                .usedLeave(employee.getUsedLeave())
                .remainingLeave(employee.getRemainingLeave())
                .role(employee.getRole())
                .createdAt(employee.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public Integer getTotalLeave() { return totalLeave; }
    public void setTotalLeave(Integer totalLeave) { this.totalLeave = totalLeave; }
    public Integer getUsedLeave() { return usedLeave; }
    public void setUsedLeave(Integer usedLeave) { this.usedLeave = usedLeave; }
    public Integer getRemainingLeave() { return remainingLeave; }
    public void setRemainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
