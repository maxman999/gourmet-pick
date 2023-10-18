package com.kjy.gourmet.utils;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

public class AuthUtil {

    public static String extractEmailFromAuth(Authentication authentication) {
        String username = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof DefaultOAuth2User) {
            DefaultOAuth2User userDetails = (DefaultOAuth2User) authentication.getPrincipal();
            username = (String) userDetails.getAttributes().get("email");
        } else if (principal instanceof User) {
            User userDetails = (User) authentication.getPrincipal();
            username = userDetails.getUsername();
        }
        return username;
    }

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


}
