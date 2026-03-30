package com.example.sbs_backend.dto.auth;

import com.example.sbs_backend.entity.UserRole;

public record AuthResponse(
        String token,
        Long userId,
        String email,
        String fullName,
        UserRole role) {
}
