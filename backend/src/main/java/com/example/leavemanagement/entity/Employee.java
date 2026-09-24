package com.example.leavemanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", unique = true, nullable = false, length = 50)
    private String employeeCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String designation;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "total_leave", nullable = false)
    private Integer totalLeave = 20;

    @Column(name = "used_leave", nullable = false)
    private Integer usedLeave = 0;

    @Column(name = "remaining_leave", nullable = false)
    private Integer remainingLeave = 20;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.EMPLOYEE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LeaveRequest> leaveRequests = new ArrayList<>();

    public Employee() {}

    public Employee(Long id, String employeeCode, String name, String email, String password, String phone,
                    String department, String designation, LocalDate joiningDate, Integer totalLeave,
                    Integer usedLeave, Integer remainingLeave, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.employeeCode = employeeCode;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.department = department;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.totalLeave = totalLeave != null ? totalLeave : 20;
        this.usedLeave = usedLeave != null ? usedLeave : 0;
        this.remainingLeave = remainingLeave != null ? remainingLeave : 20;
        this.role = role != null ? role : Role.EMPLOYEE;
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
        private String password;
        private String phone;
        private String department;
        private String designation;
        private LocalDate joiningDate;
        private Integer totalLeave = 20;
        private Integer usedLeave = 0;
        private Integer remainingLeave = 20;
        private Role role = Role.EMPLOYEE;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public Builder totalLeave(Integer totalLeave) { this.totalLeave = totalLeave; return this; }
        public Builder usedLeave(Integer usedLeave) { this.usedLeave = usedLeave; return this; }
        public Builder remainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Employee build() {
            return new Employee(id, employeeCode, name, email, password, phone, department, designation, joiningDate, totalLeave, usedLeave, remainingLeave, role, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
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
    public Integer getUsedLeave() { return usedLeave; }
    public void setUsedLeave(Integer usedLeave) { this.usedLeave = usedLeave; }
    public Integer getRemainingLeave() { return remainingLeave; }
    public void setRemainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<LeaveRequest> getLeaveRequests() { return leaveRequests; }
    public void setLeaveRequests(List<LeaveRequest> leaveRequests) { this.leaveRequests = leaveRequests; }
}
