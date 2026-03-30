package com.example.sbs_backend.dto.room;

public record RoomAvailabilityResponse(
        Long roomId,
        boolean available) {
}
