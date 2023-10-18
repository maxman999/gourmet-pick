package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;

public interface VotingService {

    void userRegisterHandler(String roomId, String sessionId, String userId);

    boolean isSessionDuplicated(String sessionId);

    void creatVotingSession(String roomId);

    void syncHandler(String roomId, String userId);

    void cancelHandler(String roomId);

    void userSeatingHandler(String roomId, String sessionId, String userId);

    void startVoting(String roomId, String userName);

    void decidePreference(String roomId, Ballot ballot);

    void finishVoting(String roomId, String sessionId, String userName);

    void disconnectSession(String sessionId);
}
