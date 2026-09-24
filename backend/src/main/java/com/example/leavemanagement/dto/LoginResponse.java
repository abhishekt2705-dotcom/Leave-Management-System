package com.example.leavemanagement.dto;

import com.example.leavemanagement.entity.Role;

public class LoginResponse {
    private String message;
    private Role role;
    private Long employeeId;
    private String name;
    private String email;
    private String employeeCode;
    private String department;

    public LoginResponse() {}

    public LoginResponse(String message, Role role, Long employeeId, String name, String email, String employeeCode, String department) {
        this.message = message;
        this.role = role;
        this.employeeId = employeeId;
        this.name = name;
        this.email = email;
        this.employeeCode = employeeCode;
        this.department = department;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String message;
        private Role role;
        private Long employeeId;
        private String name;
        private String email;
        private String employeeCode;
        private String department;

        public Builder message(String message) { this.message = message; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder department(String department) { this.department = department; return this; }

        public LoginResponse build() {
            return new LoginResponse(message, role, employeeId, name, email, employeeCode, department);
        }
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
