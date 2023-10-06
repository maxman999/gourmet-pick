package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.Message;
import com.kjy.gourmet.domain.dto.SessionStatus;
import com.kjy.gourmet.domain.dto.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, SessionStatus> votingSessions = new ConcurrentHashMap<>();
    private final int ROOM_THRESHOLD = 1;

    @Override
    public void addSession(String sessionId, WebSocketSession session) {
    }

    @Override
    public void removeSession(String sessionId) {
    }

    @Override
    public SessionStatus getSession(String sessionId) {
        return votingSessions.get(sessionId);
    }

    @Override
    public void memberSeatingHandler(String roomId, String username) {
        Message tempMsg;

        if (votingSessions.containsKey(roomId)) {
            votingSessions.get(roomId).getUsers().add(username);
        } else {
            HashSet<String> userNames = new HashSet<>();
            userNames.add(username);
            votingSessions.put(roomId, new SessionStatus(userNames, new HashMap<>()));
        }

        int userCnt = votingSessions.get(roomId).getUsers().size();

        if (userCnt >= ROOM_THRESHOLD) {
            tempMsg = new Message("kjy55", "people", "과반 이상 입장!", "20231004", Status.READY, userCnt);
        } else {
            tempMsg = new Message("kjy55", "people", "입장!", "20231004", Status.JOIN, userCnt);
        }
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, tempMsg);
    }

    @Override
    public void decideHandler(String roomId, Ballot ballot) {
        HashMap<String, Integer> votingStatus = votingSessions.get(roomId).getVotingStatus();
        String targetMenu = ballot.getMenuName();
        if (votingStatus.containsKey(targetMenu)) {
            int totalPreference = votingStatus.get(targetMenu) + ballot.getPreference();
            votingStatus.put(targetMenu, totalPreference);
        } else {
            votingStatus.put(targetMenu, ballot.getPreference());
        }
    }


}
