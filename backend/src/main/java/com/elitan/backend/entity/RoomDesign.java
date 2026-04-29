package com.elitan.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_designs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDesign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String designData;

    private String thumbnailUrl;

    @Column(name = "is_template", nullable = false)
    @JsonProperty("template")
    @Builder.Default
    private boolean template = false;

    // Cột TEMPLATE (Dùng cho DB compatibility, hoàn toàn ẩn khỏi JSON)
    @Column(name = "template", nullable = false)
    @JsonIgnore
    @Builder.Default
    private boolean templateCompatibility = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Helper method để đồng bộ hóa cả 2 cột khi set
    public void setTemplate(boolean value) {
        this.template = value;
        this.templateCompatibility = value;
    }
    
    // Explicit getter to ensure JPA/Jackson find it
    public boolean isTemplate() {
        return this.template;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
