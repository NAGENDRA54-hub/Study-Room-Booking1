package com.example.sbs_backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.sbs_backend.dto.booking.BookingRequest;
import com.example.sbs_backend.dto.booking.BookingResponse;
import com.example.sbs_backend.dto.report.AdminReportResponse;
import com.example.sbs_backend.entity.Booking;
import com.example.sbs_backend.entity.BookingStatus;
import com.example.sbs_backend.entity.Room;
import com.example.sbs_backend.entity.RoomStatus;
import com.example.sbs_backend.entity.User;
import com.example.sbs_backend.entity.UserRole;
import com.example.sbs_backend.exception.BadRequestException;
import com.example.sbs_backend.exception.ConflictException;
import com.example.sbs_backend.exception.ResourceNotFoundException;
import com.example.sbs_backend.repository.BookingRepository;
import com.example.sbs_backend.repository.RoomRepository;
import com.example.sbs_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final RoomRepository roomRepository;

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = getUserByEmail(userEmail);
        Room room = roomService.getRoomEntity(request.roomId());

        validateBookingWindow(request);
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new BadRequestException("Room is not available for booking");
        }

        boolean conflict = bookingRepository.existsConflictingBooking(
                room.getId(),
                request.startTime(),
                request.endTime(),
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED),
                null);
        if (conflict) {
            throw new ConflictException("The selected time slot conflicts with an existing booking");
        }

        Booking booking = bookingRepository.save(Booking.builder()
                .user(user)
                .room(room)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .status(BookingStatus.PENDING)
                .totalPrice(calculatePrice(room, request))
                .build());

        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookings(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Booking> bookings = user.getRole() == UserRole.ADMIN
                ? bookingRepository.findAllByOrderByStartTimeDesc()
                : bookingRepository.findByUserIdOrderByStartTimeDesc(user.getId());
        return bookings.stream().map(this::toResponse).toList();
    }

    @Transactional
    public void cancelBooking(Long bookingId, String userEmail) {
        User currentUser = getUserByEmail(userEmail);
        Booking booking = getBooking(bookingId);

        boolean isOwner = booking.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You cannot cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBooking(bookingId);
        if (status == BookingStatus.PENDING) {
            throw new BadRequestException("Bookings cannot be manually moved back to pending");
        }

        if (status == BookingStatus.CONFIRMED) {
            boolean conflict = bookingRepository.existsConflictingBooking(
                    booking.getRoom().getId(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    List.of(BookingStatus.CONFIRMED),
                    booking.getId());
            if (conflict) {
                throw new ConflictException("Cannot approve booking because the room is no longer available");
            }
        }

        booking.setStatus(status);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public AdminReportResponse getAdminReport() {
        BigDecimal revenue = bookingRepository.sumTotalPriceByStatus(BookingStatus.CONFIRMED);
        return new AdminReportResponse(
                userRepository.count(),
                roomRepository.count(),
                roomRepository.findAll().stream().filter(room -> room.getStatus() == RoomStatus.AVAILABLE).count(),
                bookingRepository.count(),
                bookingRepository.countByStatus(BookingStatus.PENDING),
                bookingRepository.countByStatus(BookingStatus.CONFIRMED),
                bookingRepository.countByStatus(BookingStatus.CANCELLED),
                revenue == null ? BigDecimal.ZERO : revenue);
    }

    private Booking getBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateBookingWindow(BookingRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BadRequestException("End time must be after start time");
        }
    }

    private BigDecimal calculatePrice(Room room, BookingRequest request) {
        long minutes = Duration.between(request.startTime(), request.endTime()).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        return room.getPricePerHour().multiply(hours).setScale(2, RoundingMode.HALF_UP);
    }

    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getRoom().getId(),
                booking.getRoom().getName(),
                booking.getRoom().getLocation(),
                booking.getUser().getId(),
                booking.getUser().getFullName(),
                booking.getUser().getEmail(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus(),
                booking.getTotalPrice());
    }
}
