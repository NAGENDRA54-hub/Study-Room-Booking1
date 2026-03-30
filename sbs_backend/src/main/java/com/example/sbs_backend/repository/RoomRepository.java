package com.example.sbs_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sbs_backend.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByNameIgnoreCase(String name);
}
