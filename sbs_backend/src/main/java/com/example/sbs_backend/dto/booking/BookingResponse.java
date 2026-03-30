package com.example.sbs_backend.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.sbs_backend.entity.BookingStatus;

public record BookingResponse(
        Long id,
        Long roomId,
        String roomName,
        String roomLocation,
        Long userId,
        String userName,
        String userEmail,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BookingStatus status,
        BigDecimal totalPrice) {
}
