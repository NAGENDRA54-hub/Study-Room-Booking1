package com.example.sbs_backend.dto.room;

import java.math.BigDecimal;

import com.example.sbs_backend.entity.RoomStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RoomRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull @Min(1) Integer capacity,
        @NotBlank @Size(max = 200) String location,
        @NotNull @DecimalMin("0.00") BigDecimal pricePerHour,
        @Size(max = 1000) String amenities,
        @NotNull RoomStatus status) {
}
