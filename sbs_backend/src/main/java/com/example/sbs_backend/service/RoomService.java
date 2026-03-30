package com.example.sbs_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.sbs_backend.dto.room.RoomAvailabilityResponse;
import com.example.sbs_backend.dto.room.RoomRequest;
import com.example.sbs_backend.dto.room.RoomResponse;
import com.example.sbs_backend.entity.BookingStatus;
import com.example.sbs_backend.entity.Room;
import com.example.sbs_backend.entity.RoomStatus;
import com.example.sbs_backend.exception.ConflictException;
import com.example.sbs_backend.exception.ResourceNotFoundException;
import com.example.sbs_backend.repository.BookingRepository;
import com.example.sbs_backend.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public RoomResponse getRoomById(Long roomId) {
        return toResponse(getRoomEntity(roomId));
    }

    public RoomResponse createRoom(RoomRequest request) {
        String roomName = request.name().trim();
        if (roomRepository.existsByNameIgnoreCase(roomName)) {
            throw new ConflictException("A room with this name already exists");
        }

        Room room = roomRepository.save(Room.builder()
                .name(roomName)
                .capacity(request.capacity())
                .location(request.location().trim())
                .pricePerHour(request.pricePerHour())
                .amenities(request.amenities())
                .status(request.status())
                .build());
        return toResponse(room);
    }

    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = getRoomEntity(roomId);
        String roomName = request.name().trim();
        if (!room.getName().equalsIgnoreCase(roomName) && roomRepository.existsByNameIgnoreCase(roomName)) {
            throw new ConflictException("A room with this name already exists");
        }

        room.setName(roomName);
        room.setCapacity(request.capacity());
        room.setLocation(request.location().trim());
        room.setPricePerHour(request.pricePerHour());
        room.setAmenities(request.amenities());
        room.setStatus(request.status());
        return toResponse(roomRepository.save(room));
    }

    public void deleteRoom(Long roomId) {
        Room room = getRoomEntity(roomId);
        roomRepository.delete(room);
    }

    public RoomAvailabilityResponse checkAvailability(Long roomId, LocalDateTime startTime, LocalDateTime endTime) {
        Room room = getRoomEntity(roomId);
        boolean available = room.getStatus() == RoomStatus.AVAILABLE
                && !bookingRepository.existsConflictingBooking(
                        roomId,
                        startTime,
                        endTime,
                        List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED),
                        null);
        return new RoomAvailabilityResponse(roomId, available);
    }

    public Room getRoomEntity(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
    }

    private RoomResponse toResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                room.getLocation(),
                room.getPricePerHour(),
                room.getAmenities(),
                room.getStatus());
    }
}
