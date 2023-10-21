package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.VotingSession;
import com.kjy.gourmet.domain.dto.VotingStatus;
import com.kjy.gourmet.domain.room.Room;

import java.util.List;

public interface VotingService {

    void userRegisterHandler(String sessionId, long roomId, long userId);

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
