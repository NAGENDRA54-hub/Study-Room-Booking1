package com.example.sbs_backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sbs_backend.dto.report.AdminReportResponse;
import com.example.sbs_backend.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BookingService bookingService;

    @GetMapping("/reports/summary")
    public AdminReportResponse getSummary() {
        return bookingService.getAdminReport();
    }
}
