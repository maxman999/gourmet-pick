package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.domain.dto.*;
import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.menu.MenuService;
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
    private final Map<String, SessionMapper> sessionMapper = new ConcurrentHashMap<>();
    private final Map<Long, VotingSession> votingSessions = new ConcurrentHashMap<>();
    private final int ROOM_CAPACITY = 2;

    private final MenuService menuService;


    @Override
    public void userRegisterHandler(String sessionId, long roomId, long userId) {
        sessionMapper.put(sessionId, new SessionMapper(userId, roomId));
    }

    @Override
    public boolean isSessionDuplicated(String sessionId) {
        return sessionMapper.containsKey(sessionId);
    }

    @Override
    public void creatVotingSession(String sessionId, long roomId, long userId) {
        if (!votingSessions.containsKey(roomId)) {
            votingSessions.put(roomId, new VotingSession());
        } else {
            log.error("기존에 지워지지 않은 투표 세션이 있었음 =====> 방번호 : {}", roomId);
            log.error("세션 정보 : {}", votingSessions.get(roomId));
            votingSessions.put(roomId, new VotingSession());
        }
        Message votingReadyMsg = new Message("server", "people", "투표 세션 생성", VotingStatus.CREATE, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);

        userSeatingHandler(sessionId, roomId, userId);
    }

    @Override
    public void syncHandler(String userEmail, long roomId, long userId) {
        // 최초 입장시 방 동기화(투표여부 검사)
        if (votingSessions.containsKey(roomId)) {
            userSeatingHandler(userEmail, roomId, userId);
        }
    }

    @Override
    public void cancelHandler(long roomId) {
        votingSessions.remove(roomId);
        Message votingReadyMsg = new Message("server", "people", "투표 강제 종료", VotingStatus.CANCEL, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
    }

    @Override
    public void userSeatingHandler(String sessionId, long roomId, long userId) {
        assert votingSessions.containsKey(roomId);
        // 투표 세션에 유저 등록
        votingSessions.get(roomId).getUsers().add(sessionId);
        // 입장 유저 수 집계
        int userCnt = votingSessions.get(roomId).getUsers().size();
        Message userSeatingMsg = new Message("server", "people", "입장!", VotingStatus.SEATING, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, userSeatingMsg);

        if (userCnt >= ROOM_CAPACITY) {
            Message votingReadyMsg = new Message("kjy55", "people", "과반 이상 입장!", VotingStatus.READY, userCnt);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
        }
    }

    @Override
    public void startVoting(long roomId) {
        Message votingStartMsg = new Message("server", "people", "투표 시작!", VotingStatus.START, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingStartMsg);
    }

    @Override
    public void soberDecision(long roomId, Ballot ballot) {
        HashMap<Long, Integer> votingStatus = votingSessions.get(roomId).getAggregation();
        long targetMenuId = ballot.getMenuId();
        if (votingStatus.containsKey(targetMenuId)) {
            int totalPreference = votingStatus.get(targetMenuId) + ballot.getPreference();
            votingStatus.put(targetMenuId, totalPreference);
        } else {
            votingStatus.put(targetMenuId, ballot.getPreference());
        }
    }

    @Override
    public void finishVoting(String sessionId, long roomId) {
        HashSet<String> finishCalls = votingSessions.get(roomId).getFinishCalls();
        int currentSessionUserCnt = votingSessions.get(roomId).getUsers().size();
        finishCalls.add(sessionId);
        // 투표 끝난 유저의 세션정보 제거
        sessionMapper.remove(sessionId);
        votingSessions.get(roomId).getUsers().remove(sessionId);

        if (finishCalls.size() >= currentSessionUserCnt) {
            // 투표 집계
            HashMap<Long, Integer> votingStatus = votingSessions.get(roomId).getAggregation();
            long todayPickMenuId = Collections.max(votingStatus.entrySet(), Map.Entry.comparingByValue()).getKey();
            menuService.insertTodayPick(roomId, todayPickMenuId);
            Menu todayPick = menuService.getMenuById(todayPickMenuId);
            // 집계 결과 송출
            Message endMessage = new Message("server", "people", "투표완료", VotingStatus.FINISH, todayPick);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
            // session cleanup
            votingSessions.remove(roomId);
        }
    }

    @Override
    public List<Room> setCurrentVotingSessionStatus(List<Room> myRoomList) {
        myRoomList.forEach(room -> {
            if (votingSessions.containsKey(room.getId())) {
                int userCnt = votingSessions.get(room.getId()).getUsers().size();
                room.setHasVotingSession(true);
                room.setCurrentVotingUserCnt(userCnt);
            }
        });
        return myRoomList;
    }

    @Override
    public VotingSession getVotingSessionByRoomId(long roomId) {
        return votingSessions.getOrDefault(roomId, null);
    }

    @Override
    public void exileAllUsers(long roomId) {
        Message endMessage = new Message("server", "people", "투표방 삭제", VotingStatus.EXILE, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
    }


    @Override
    public void disconnectSession(String sessionId) {
        SessionMapper sessionInfo = sessionMapper.get(sessionId);
        if (sessionInfo == null) {
            log.warn("cannot find sessionInfo");
            return;
        }
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
        // 연결이 끊긴 유저의 세션 정리
        sessionMapper.remove(sessionId);
        Message message = new Message("server", "people", "유저이탈", VotingStatus.DISCONNECT, targetRoomUserCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + sessionInfo.getRoomId(), message);
        log.info("Session disconnected : {}", sessionId);
    }
}
