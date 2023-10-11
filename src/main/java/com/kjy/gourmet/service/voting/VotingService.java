package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.SessionStatus;
import org.springframework.web.socket.WebSocketSession;

public interface VotingService {
    void memberRegisterHandler(String roomId, String sessionId, String userId);

    void syncHandler(String roomId, String userId);

    void memberSeatingHandler(String roomId, String sessionId, String userId);

    void startVoting(String roomId, String userName);

    void decidePreference(String roomId, Ballot ballot);

    void finishVoting(String roomId, String sessionId, String userName);

    void disconnectSession(String sessionId);
}
