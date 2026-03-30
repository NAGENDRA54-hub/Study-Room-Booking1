package com.example.sbs_backend.security;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.example.sbs_backend.entity.Room;
import com.example.sbs_backend.entity.RoomStatus;
import com.example.sbs_backend.repository.RoomRepository;

@Configuration
@Profile("local")
public class LocalDataBootstrapConfig {

    @Bean
    CommandLineRunner bootstrapRooms(RoomRepository roomRepository) {
        return args -> {
            if (roomRepository.count() > 0) {
                return;
            }

            roomRepository.saveAll(List.of(
                    Room.builder()
                            .name("Quiet Focus Room")
                            .capacity(4)
                            .location("North Library - Floor 2")
                            .pricePerHour(new BigDecimal("8.50"))
                            .amenities("Whiteboard, monitor, natural light, power outlets")
                            .status(RoomStatus.AVAILABLE)
                            .build(),
                    Room.builder()
                            .name("Collaboration Hub")
                            .capacity(8)
                            .location("Innovation Block - Wing B")
                            .pricePerHour(new BigDecimal("12.00"))
                            .amenities("Conference display, marker wall, video call setup")
                            .status(RoomStatus.AVAILABLE)
                            .build(),
                    Room.builder()
                            .name("Silent Study Pod")
                            .capacity(2)
                            .location("South Annex - Floor 1")
                            .pricePerHour(new BigDecimal("6.00"))
                            .amenities("Acoustic panels, compact desk, charging dock")
                            .status(RoomStatus.MAINTENANCE)
                            .build()));
        };
    }
}
