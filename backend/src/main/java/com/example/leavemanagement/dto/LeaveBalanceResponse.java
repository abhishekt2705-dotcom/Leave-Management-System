package com.example.leavemanagement.dto;

public class LeaveBalanceResponse {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private Integer totalLeave;
    private Integer usedLeave;
    private Integer remainingLeave;
    private Long pendingRequestsCount;

    public LeaveBalanceResponse() {}

    public LeaveBalanceResponse(Long employeeId, String employeeName, String employeeCode, Integer totalLeave, Integer usedLeave, Integer remainingLeave, Long pendingRequestsCount) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.totalLeave = totalLeave;
        this.usedLeave = usedLeave;
        this.remainingLeave = remainingLeave;
        this.pendingRequestsCount = pendingRequestsCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long employeeId;
        private String employeeName;
        private String employeeCode;
        private Integer totalLeave;
        private Integer usedLeave;
        private Integer remainingLeave;
        private Long pendingRequestsCount;

        public Builder employeeId(Long employeeId) { this.employeeId = employeeId; return this; }
        public Builder employeeName(String employeeName) { this.employeeName = employeeName; return this; }
        public Builder employeeCode(String employeeCode) { this.employeeCode = employeeCode; return this; }
        public Builder totalLeave(Integer totalLeave) { this.totalLeave = totalLeave; return this; }
        public Builder usedLeave(Integer usedLeave) { this.usedLeave = usedLeave; return this; }
        public Builder remainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; return this; }
        public Builder pendingRequestsCount(Long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; return this; }

        public LeaveBalanceResponse build() {
            return new LeaveBalanceResponse(employeeId, employeeName, employeeCode, totalLeave, usedLeave, remainingLeave, pendingRequestsCount);
        }
    }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }
    public Integer getTotalLeave() { return totalLeave; }
    public void setTotalLeave(Integer totalLeave) { this.totalLeave = totalLeave; }
    public Integer getUsedLeave() { return usedLeave; }
    public void setUsedLeave(Integer usedLeave) { this.usedLeave = usedLeave; }
    public Integer getRemainingLeave() { return remainingLeave; }
    public void setRemainingLeave(Integer remainingLeave) { this.remainingLeave = remainingLeave; }
    public Long getPendingRequestsCount() { return pendingRequestsCount; }
    public void setPendingRequestsCount(Long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }
}
