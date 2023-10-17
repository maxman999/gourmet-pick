package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, VotingSession> votingSessions = new ConcurrentHashMap<>();
    private final Map<String, SessionMapper> sessionMapper = new ConcurrentHashMap<>();
    private final int ROOM_CAPACITY = 2;


    @Override
    public void userRegisterHandler(String roomId, String sessionId, String userId) {
        sessionMapper.put(sessionId, new SessionMapper(userId, roomId));
    }

    @Override
    public void creatVotingSession(String roomId) {
        if (!votingSessions.containsKey(roomId)) {
            votingSessions.put(roomId, new VotingSession());
        } else {
            log.warn("기존에 지워지지 않은 투표 세션이 있었음 =====> 방번호 : {}", roomId);
            log.warn("세션 정보 : {}", votingSessions.get(roomId));
            votingSessions.put(roomId, new VotingSession());
        }
        Message votingReadyMsg = new Message("server", "people", "투표 세션 생성", "20231004", VotingStatus.CREATE, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
    }

    @Override
    public void syncHandler(String roomId, String userId) {
        // 방 동기화
        if (votingSessions.containsKey(roomId)) {
            int userCnt = votingSessions.get(roomId).getUsers().size();
            Message endMessage = new Message("server", "people", "동기화", "20231004", VotingStatus.SYNC, userCnt);
            simpMessagingTemplate.convertAndSendToUser(userId, "/private", endMessage);
        }
    }

    @Override
    public void cancelHandler(String roomId) {
        votingSessions.remove(roomId);
        Message votingReadyMsg = new Message("kjy55", "people", "투표 강제 종료", "20231004", VotingStatus.CANCEL, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
    }

    @Override
    public void userSeatingHandler(String roomId, String sessionId, String userId) {
        // 투표 세션 생성/추가
        if (!votingSessions.containsKey(roomId)) {
            throw new RuntimeException();
        }
        // 투표 세션에 유저 등록
        votingSessions.get(roomId).getUsers().add(sessionId);
        // 입장 유저 수 집계
        int userCnt = votingSessions.get(roomId).getUsers().size();
        System.out.println("userCnt : " + userCnt);

        Message userSeatingMsg = new Message("server", "people", "입장!", "20231004", VotingStatus.SEATING, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, userSeatingMsg);

        if (userCnt >= ROOM_CAPACITY) {
            Message votingReadyMsg = new Message("kjy55", "people", "과반 이상 입장!", "20231004", VotingStatus.READY, userCnt);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
        }
    }

    @Override
    public void startVoting(String roomId, String userName) {
        Message votingStartMsg = new Message("server", "people", "투표 시작!", "20231004", VotingStatus.START, 0);
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
            Message endMessage = new Message("server", "people", "투표완료", "20231004", VotingStatus.FINISH, maxKey);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
            // session cleanup
            votingSessions.remove(roomId);
        }
        sessionMapper.remove(sessionId);
        votingSessions.get(roomId).getUsers().remove(sessionId);
    }


    @Override
    public void disconnectSession(String sessionId) {
        SessionMapper sessionInfo = sessionMapper.get(sessionId);
        VotingSession targetRoomSessionStatus = votingSessions.get(sessionInfo.getRoomId());
        int targetRoomUserCnt = 0;
        // 해당 유저와 관련된 투표 세션이 있다면 정리해줌
        if (targetRoomSessionStatus != null) {
            targetRoomSessionStatus.getUsers().remove(sessionId);
            targetRoomUserCnt = targetRoomSessionStatus.getUsers().size();
            // 투표 세션에 참여중인 유저의 연결이 모두 끊어지면 투표 세션 자체를 없애버림
            if (targetRoomUserCnt == 0) {
                votingSessions.remove(sessionInfo.getRoomId());
            }
        }
        sessionMapper.remove(sessionId);
        Message message = new Message("server", "people", "유저이탈", "20231004", VotingStatus.DISCONNECT, targetRoomUserCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + sessionInfo.getRoomId(), message);
        log.info("Session disconnected : {}", sessionId);
    }
}
