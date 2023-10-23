package com.kjy.gourmet.utils;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.security.SecureRandom;

public class AuthUtil {
    private static final String ALLOWED_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    public static String extractUserEmailFromSimpHeader(SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = "";
        Object authToken = headerAccessor.getMessageHeaders().get("simpUser");
        if (authToken instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authToken;
            userEmail = (String) token.getPrincipal().getAttributes().get("email");
        } else if (authToken instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authToken;
            userEmail = token.getName();
        }
        return userEmail;
    }

    public static String generateInviteCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(ALLOWED_CHARACTERS.length());
            sb.append(ALLOWED_CHARACTERS.charAt(randomIndex));
        }
        return sb.toString();
    }
}
