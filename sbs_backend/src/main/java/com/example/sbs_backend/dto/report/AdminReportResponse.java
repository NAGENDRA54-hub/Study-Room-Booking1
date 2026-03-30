package com.example.sbs_backend.dto.report;

import java.math.BigDecimal;

public record AdminReportResponse(
        long totalUsers,
        long totalRooms,
        long availableRooms,
        long totalBookings,
        long pendingBookings,
        long confirmedBookings,
        long cancelledBookings,
        BigDecimal confirmedRevenue) {
}
