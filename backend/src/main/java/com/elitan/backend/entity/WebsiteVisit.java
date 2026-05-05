package com.elitan.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "website_visits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ipAddress;
    private String userAgent;

    @Builder.Default
    private LocalDateTime visitDate = LocalDateTime.now();
}
