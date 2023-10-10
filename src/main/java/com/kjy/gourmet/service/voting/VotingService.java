package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.SessionStatus;
import org.springframework.web.socket.WebSocketSession;

public interface VotingService {
    void addSession(String sessionId, WebSocketSession session);

    void removeSession(String sessionId);

    boolean getRoomState(String roomId);

    void memberSeatingHandler(String roomId, String sessionId, String userId);

    void decidePreference(String roomId, Ballot ballot);

    void finishVoting(String roomId, String sessionId, String userName);

    void disconnectSession(String sessionId);
}
