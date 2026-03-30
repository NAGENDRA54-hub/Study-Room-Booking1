package com.example.sbs_backend.dto.room;

import java.math.BigDecimal;

import com.example.sbs_backend.entity.RoomStatus;

public record RoomResponse(
        Long id,
        String name,
        Integer capacity,
        String location,
        BigDecimal pricePerHour,
        String amenities,
        RoomStatus status) {
}
