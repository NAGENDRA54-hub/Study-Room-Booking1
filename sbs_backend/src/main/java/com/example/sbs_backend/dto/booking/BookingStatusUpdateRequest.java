package com.example.sbs_backend.dto.booking;

import com.example.sbs_backend.entity.BookingStatus;

import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
        @NotNull BookingStatus status) {
}
