package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.domain.dto.Message;
import com.kjy.gourmet.domain.dto.SessionStatus;
import com.kjy.gourmet.domain.dto.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, SessionStatus> votingSessions = new ConcurrentHashMap<>();
    private final int ROOM_CAPACITY = 2;

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
    public void memberSeatingHandler(String roomId, String userName) {
        // 투표 세션 생성/추가
        if (votingSessions.containsKey(roomId)) {
            votingSessions.get(roomId).getUsers().add(userName);
        } else {
            votingSessions.put(roomId, new SessionStatus(userName));
        }
        // 입장 유저 수 집계
        int userCnt = votingSessions.get(roomId).getUsers().size();
        System.out.println("userCnt : " + userCnt);

        Message userJoinMsg = new Message("kjy55", "people", "입장!", "20231004", Status.JOIN, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, userJoinMsg);

        if (userCnt >= ROOM_CAPACITY) {
            Message votingStartMsg = new Message("kjy55", "people", "과반 이상 입장!", "20231004", Status.READY, userCnt);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingStartMsg);
        }
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

    @Override
    public void finishHandler(String roomId, String userName) {
        HashSet<String> finishCalls = votingSessions.get(roomId).getFinishCalls();
        int userCnt = votingSessions.get(roomId).getUsers().size();

        finishCalls.add(userName);
        if (finishCalls.size() >= userCnt) {
            // 투표 집계
            HashMap<String, Integer> votingStatus = votingSessions.get(roomId).getVotingStatus();
            String maxKey = Collections.max(votingStatus.entrySet(), Map.Entry.comparingByValue()).getKey();
            // 집계 결과 송출
            Message endMessage = new Message("server", "people", "투표완료", "20231004", Status.END, maxKey);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
            // session cleanup
            votingSessions.remove(roomId);
        }
    }
}
