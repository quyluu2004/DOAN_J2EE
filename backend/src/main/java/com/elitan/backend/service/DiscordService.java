package com.elitan.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiscordService {

    private final RestTemplate restTemplate;

    @Value("${discord.bot.token}")
    private String botToken;

    /**
     * Gửi tin nhắn Direct Message (DM) cho một User Discord.
     * Cần ID người dùng Discord (Snowflake).
     */
    public void sendMessage(String userId, String text) {
        try {
            // Bước 1: Tạo một DM Channel với User
            String createChannelUrl = "https://discord.com/api/v10/users/@me/channels";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bot " + botToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> channelBody = Map.of("recipient_id", userId);
            HttpEntity<Map<String, String>> channelRequest = new HttpEntity<>(channelBody, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> channelResponse = restTemplate.postForObject(createChannelUrl, channelRequest, Map.class);

            if (channelResponse != null && channelResponse.containsKey("id")) {
                String channelId = (String) channelResponse.get("id");

                // Bước 2: Gửi tin nhắn vào Channel vừa tạo
                String sendMessageUrl = "https://discord.com/api/v10/channels/" + channelId + "/messages";
                Map<String, String> messageBody = Map.of("content", text);
                HttpEntity<Map<String, String>> messageRequest = new HttpEntity<>(messageBody, headers);

                restTemplate.postForObject(sendMessageUrl, messageRequest, String.class);
            }
        } catch (Exception e) {
            System.err.println("Failed to send Discord message: " + e.getMessage());
        }
    }
}
