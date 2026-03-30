package com.example.sbs_backend.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.sbs_backend.entity.Booking;
import com.example.sbs_backend.entity.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @EntityGraph(attributePaths = {"user", "room"})
    List<Booking> findByUserIdOrderByStartTimeDesc(Long userId);

    @EntityGraph(attributePaths = {"user", "room"})
    List<Booking> findAllByOrderByStartTimeDesc();

    @Query("""
            select count(b) > 0
            from Booking b
            where b.room.id = :roomId
              and b.status in :statuses
              and (:excludedBookingId is null or b.id <> :excludedBookingId)
              and (:startTime < b.endTime and :endTime > b.startTime)
            """)
    boolean existsConflictingBooking(
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("statuses") Collection<BookingStatus> statuses,
            @Param("excludedBookingId") Long excludedBookingId);

    long countByStatus(BookingStatus status);

    @Query("""
            select coalesce(sum(b.totalPrice), 0)
            from Booking b
            where b.status = :status
            """)
    BigDecimal sumTotalPriceByStatus(@Param("status") BookingStatus status);
}
