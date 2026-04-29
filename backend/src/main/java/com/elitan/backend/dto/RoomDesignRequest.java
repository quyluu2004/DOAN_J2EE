package com.elitan.backend.dto;

import lombok.Data;

@Data
public class RoomDesignRequest {
    private Long id;
    private Long userId;
    private String name;
    private String designData;
    private String thumbnailUrl;

    @com.fasterxml.jackson.annotation.JsonProperty("template")
    private Boolean template;
}
