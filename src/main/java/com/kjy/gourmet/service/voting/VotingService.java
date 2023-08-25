package com.kjy.gourmet.service.voting;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;

public interface VotingService {
    void addSession(String sessionId, WebSocketSession session);
    void removeSession(String sessionId);
    HashSet<String> getSession(String sessionId);
    void memberSeatingHandler(String roomId, String username);
    void beginVoting();
}
