package com.example.leavemanagement.dto;

import com.example.leavemanagement.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class CreateEmployeeDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String phone;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private Integer totalLeave = 20;
    private Role role = Role.EMPLOYEE;

    public CreateEmployeeDto() {}

    public CreateEmployeeDto(String name, String email, String password, String phone, String department, String designation, LocalDate joiningDate, Integer totalLeave, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.totalLeave = totalLeave != null ? totalLeave : 20;
        this.role = role != null ? role : Role.EMPLOYEE;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
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
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
