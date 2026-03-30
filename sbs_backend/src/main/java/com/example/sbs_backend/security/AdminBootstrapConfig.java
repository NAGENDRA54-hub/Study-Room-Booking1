package com.example.sbs_backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import com.example.sbs_backend.entity.User;
import com.example.sbs_backend.entity.UserRole;
import com.example.sbs_backend.repository.UserRepository;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    CommandLineRunner bootstrapAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin-email:}") String adminEmail,
            @Value("${app.bootstrap.admin-password:}") String adminPassword,
            @Value("${app.bootstrap.admin-name:SBS Administrator}") String adminName) {
        return args -> {
            if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
                return;
            }

            String normalizedEmail = adminEmail.trim().toLowerCase();
            if (userRepository.existsByEmail(normalizedEmail)) {
                return;
            }

            userRepository.save(User.builder()
                    .email(normalizedEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .fullName(adminName.trim())
                    .role(UserRole.ADMIN)
                    .build());
        };
    }
}
