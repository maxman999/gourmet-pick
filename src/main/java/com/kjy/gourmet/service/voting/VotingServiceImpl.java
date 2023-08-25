package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Message;
import com.kjy.gourmet.domain.dto.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, HashSet<String>> votingSessions = new ConcurrentHashMap<>();

    @Override
    public void addSession(String sessionId, WebSocketSession session) {
    }

    @Override
    public void removeSession(String sessionId) {
    }

    @Override
    public HashSet<String> getSession(String sessionId) {
        return votingSessions.get(sessionId);
    }

    @Override
    public void memberSeatingHandler(String roomId, String username) {
        if (votingSessions.containsKey(roomId)) {
            votingSessions.get(roomId).add(username);
        } else {
            HashSet<String> userNames = new HashSet<>();
            userNames.add(username);
            votingSessions.put(roomId, userNames);
        }
        int userCnt = votingSessions.get(roomId).size();
        Message tempMsg = new Message("kjy55", "people", "입장!", "20230816", Status.JOIN, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, tempMsg);
    }

    @Override
    public void beginVoting() {

    }

}
