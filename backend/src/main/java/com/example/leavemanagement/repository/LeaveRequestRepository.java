package com.example.leavemanagement.repository;

import com.example.leavemanagement.entity.LeaveRequest;
import com.example.leavemanagement.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployee_IdOrderByCreatedAtDesc(Long employeeId);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId " +
           "AND lr.status IN :statuses " +
           "AND lr.startDate <= :endDate " +
           "AND lr.endDate >= :startDate")
    List<LeaveRequest> findOverlappingLeaves(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<LeaveStatus> statuses
    );

    long countByStatus(LeaveStatus status);
}
