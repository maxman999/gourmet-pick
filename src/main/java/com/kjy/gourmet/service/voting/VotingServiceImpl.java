package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, SessionStatus> votingSessions = new ConcurrentHashMap<>();
    private final Map<String, SessionInfo> sessionMapper = new ConcurrentHashMap<>();
    private final int ROOM_CAPACITY = 2;

    @Override
    public void syncHandler(String roomId, String userId) {
        // 방 동기화
        if (votingSessions.containsKey(roomId)) {
            int userCnt = votingSessions.get(roomId).getUsers().size();
            Message endMessage = new Message("server", "people", "동기화", "20231004", Status.SYNC, userCnt);
            simpMessagingTemplate.convertAndSendToUser(userId, "/private", endMessage);
        }
    }

    @Override
    public void memberRegisterHandler(String roomId, String sessionId, String userId) {
        // 세션 정보 등록
        sessionMapper.put(sessionId, new SessionInfo(userId, roomId));
    }

    @Override
    public void memberSeatingHandler(String roomId, String sessionId, String userId) {
        // 투표 세션 생성/추가
        if (votingSessions.containsKey(roomId)) {
            votingSessions.get(roomId).getUsers().add(sessionId);
        } else {
            votingSessions.put(roomId, new SessionStatus(sessionId));
        }
        // 입장 유저 수 집계
        int userCnt = votingSessions.get(roomId).getUsers().size();
        System.out.println("userCnt : " + userCnt);

        Message userJoinMsg = new Message("server", "people", "입장!", "20231004", Status.JOIN, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, userJoinMsg);

        if (userCnt >= ROOM_CAPACITY) {
            Message votingReadyMsg = new Message("kjy55", "people", "과반 이상 입장!", "20231004", Status.READY, userCnt);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
        }
    }

    @Override
    public void startVoting(String roomId, String userName) {
        Message votingStartMsg = new Message("server", "people", "투표 시작!", "20231004", Status.START, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingStartMsg);
    }

    @Override
    public void decidePreference(String roomId, Ballot ballot) {
        HashMap<String, Integer> votingStatus = votingSessions.get(roomId).getAggregation();
        String targetMenu = ballot.getMenuName();
        if (votingStatus.containsKey(targetMenu)) {
            int totalPreference = votingStatus.get(targetMenu) + ballot.getPreference();
            votingStatus.put(targetMenu, totalPreference);
        } else {
            votingStatus.put(targetMenu, ballot.getPreference());
        }
    }

    @Override
    public void finishVoting(String roomId, String sessionId, String userName) {
        HashSet<String> finishCalls = votingSessions.get(roomId).getFinishCalls();
        int userCnt = votingSessions.get(roomId).getUsers().size();

        finishCalls.add(userName);
        if (finishCalls.size() >= userCnt) {
            // 투표 집계
            HashMap<String, Integer> votingStatus = votingSessions.get(roomId).getAggregation();
            String maxKey = Collections.max(votingStatus.entrySet(), Map.Entry.comparingByValue()).getKey();
            // 집계 결과 송출
            Message endMessage = new Message("server", "people", "투표완료", "20231004", Status.END, maxKey);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
            // session cleanup
            votingSessions.remove(roomId);
        }
        sessionMapper.remove(sessionId);
        votingSessions.get(roomId).getUsers().remove(sessionId);
    }


    @Override
    public void disconnectSession(String sessionId) {
        SessionInfo sessionInfo = sessionMapper.get(sessionId);
        SessionStatus targetRoomSessionStatus = votingSessions.get(sessionInfo.getRoomId());
        targetRoomSessionStatus.getUsers().remove(sessionId);
        sessionMapper.remove(sessionId);
        Message message = new Message("server", "people", "유저이탈", "20231004", Status.DISCONNECT, targetRoomSessionStatus.getUsers().size());
        simpMessagingTemplate.convertAndSend("/voting/" + sessionInfo.getRoomId(), message);
        System.out.println("Session disconnected: " + sessionId);
    }
}
