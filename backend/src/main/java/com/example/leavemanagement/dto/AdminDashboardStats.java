package com.example.leavemanagement.dto;

public class AdminDashboardStats {
    private long totalEmployees;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long totalRequests;

    public AdminDashboardStats() {}

    public AdminDashboardStats(long totalEmployees, long pendingRequests, long approvedRequests, long rejectedRequests, long totalRequests) {
        this.totalEmployees = totalEmployees;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.rejectedRequests = rejectedRequests;
        this.totalRequests = totalRequests;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private long totalEmployees;
        private long pendingRequests;
        private long approvedRequests;
        private long rejectedRequests;
        private long totalRequests;

        public Builder totalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; return this; }
        public Builder pendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; return this; }
        public Builder approvedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; return this; }
        public Builder rejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; return this; }
        public Builder totalRequests(long totalRequests) { this.totalRequests = totalRequests; return this; }

        public AdminDashboardStats build() {
            return new AdminDashboardStats(totalEmployees, pendingRequests, approvedRequests, rejectedRequests, totalRequests);
        }
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getApprovedRequests() { return approvedRequests; }
    public void setApprovedRequests(long approvedRequests) { this.approvedRequests = approvedRequests; }
    public long getRejectedRequests() { return rejectedRequests; }
    public void setRejectedRequests(long rejectedRequests) { this.rejectedRequests = rejectedRequests; }
    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
}
