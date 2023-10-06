package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.SessionStatus;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;

public interface VotingService {
    void addSession(String sessionId, WebSocketSession session);
    void removeSession(String sessionId);
    SessionStatus getSession(String sessionId);
    void memberSeatingHandler(String roomId, String username);
    void decideHandler(String roomId, Ballot ballot);
}
