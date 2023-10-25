package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.service.voting.dto.Ballot;
import com.kjy.gourmet.service.voting.dto.VotingSession;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.web.dto.WebSocketUser;

import java.util.List;

public interface VotingService {

    void userRegisterHandler(String sessionId, WebSocketUser webSocketUser);

    boolean isSessionDuplicated(String sessionId);

    boolean isVotingOngoing(long roomId);

    void creatVotingSession(String sessionId, long roomId, long userId);

    List<Menu> getTodayMenuListFromSession(SessionUser user);

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
