package com.example.sbs_backend.dto.booking;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
        @NotNull Long roomId,
        @NotNull @Future LocalDateTime startTime,
        @NotNull @Future LocalDateTime endTime) {
}
