package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.VotingSession;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.web.dto.WebSocketUser;

import java.util.List;

public interface VotingService {

    void userRegisterHandler(String sessionId, WebSocketUser webSocketUser);

    boolean isSessionDuplicated(String sessionId);

    void creatVotingSession(String sessionId, long roomId, long userId);

    void syncHandler(String sessionId, long roomId, long userId);

    void cancelHandler(long roomId);

    void userSeatingHandler(String sessionId, long roomId, long userId);

    void startVoting(long roomId);

    void soberDecision(long roomId, Ballot ballot);

    void finishVoting(String sessionId, long roomId);

    List<Room> setCurrentVotingSessionStatus(List<Room> myRoomList);

    void exileAllUsers(long roomId);

    void disconnectSession(String sessionId);

    VotingSession getVotingSessionByRoomId(long roomId);
}
