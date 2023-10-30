package com.kjy.gourmet.service.voting;

import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.voting.dto.Ballot;
import com.kjy.gourmet.service.voting.dto.Message;
import com.kjy.gourmet.service.voting.dto.VotingSession;
import com.kjy.gourmet.service.voting.dto.VotingStatus;
import com.kjy.gourmet.web.dto.WebSocketUser;
import com.mysql.cj.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Component
public class VotingServiceImpl implements VotingService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Map<String, WebSocketUser> sessionMapper = new ConcurrentHashMap<>();
    private final Map<Long, VotingSession> votingSessions = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
    private final int ROOM_CAPACITY = 10;

    private final MenuService menuService;


    @Override
    public void userRegisterHandler(String sessionId, WebSocketUser webSocketUser) {
        long roomId = webSocketUser.getRoomId();
        sessionMapper.put(sessionId, webSocketUser);
        // 최초 입장시 방 동기화(투표 진행 여부 검사)
        if (votingSessions.containsKey(roomId)) {
            userSeatingHandler(sessionId, roomId, webSocketUser.getId());
            log.info("{}번 방에 {}님 입장", webSocketUser.getRoomId(), webSocketUser.getNickname());
        }
    }

    @Override
    public boolean isSessionDuplicated(String sessionId) {
        return sessionMapper.containsKey(sessionId);
    }

    @Override
    public boolean isVotingOngoing(long roomId) {
        return votingSessions.containsKey(roomId)
                && votingSessions.get(roomId).isVotingOnGoing();
    }

    @Override
    public boolean isRoomCapacityExceeded(long roomId) {
        return votingSessions.containsKey(roomId)
                && votingSessions.get(roomId).getUsers().size() >= ROOM_CAPACITY;
    }

    @Override
    public void creatVotingSession(String sessionId, long roomId, long userId) {
        if (votingSessions.containsKey(roomId)) {
            log.error("기존에 지워지지 않은 투표 세션이 있었음 =====> 방번호 : {} / 세션 정보 : {}", roomId, votingSessions.get(roomId));
        }
        votingSessions.put(roomId, new VotingSession());
        votingSessions.get(roomId).setVotingCaller(userId);

        // 오늘의 투표 메뉴 선정
        List<Menu> todayMenuList = menuService.getTodayMenuList(roomId);
        votingSessions.get(roomId).setTodayMenuList(todayMenuList);

        userSeatingHandler(sessionId, roomId, userId);

        Message votingReadyMsg = new Message("person", userId, "people", VotingStatus.CREATE, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingReadyMsg);
    }

    @Override
    public List<Menu> getTodayMenuListFromSession(SessionUser user) {
        if (!sessionMapper.containsKey(user.getEmail())) {

            return null;
        }
        long roomId = sessionMapper.get(user.getEmail()).getRoomId();
        if (votingSessions.get(roomId) == null) return new ArrayList<>();
        return votingSessions.get(roomId).getTodayMenuList();
    }

    @Override
    public void cancelHandler(long roomId) {
        votingSessions.remove(roomId);
        Message votingCancelMsg = new Message("user", 0, "people", VotingStatus.CANCEL, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, votingCancelMsg);
    }

    @Override
    public void userSeatingHandler(String sessionId, long roomId, long userId) {
        if (!votingSessions.containsKey(roomId)) return;
        // 투표 세션에 유저 등록
        votingSessions.get(roomId).getUsers().add(sessionId);
        // 입장 유저 수 집계
        HashSet<String> users = votingSessions.get(roomId).getUsers();
        String senderNickname = sessionMapper.get(sessionId).getNickname();
        Message userSeatingMsg = new Message(senderNickname, userId, "people", VotingStatus.SEATING, getUserNicknamesFromUserList(users));
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, userSeatingMsg);
    }

    @Override
    public void startVoting(long roomId) {
        votingSessions.get(roomId).setVotingOnGoing(true);
        Message votingStartMsg = new Message("user", 0, "people", VotingStatus.START, 0);
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
        VotingSession session = votingSessions.get(roomId);
        if (session == null) return;

        HashSet<String> finishCalls = session.getFinishCalls();
        finishCalls.add(sessionId);
        int currentSessionUserCnt = session.getUsers().size();
        session.getUsers().remove(sessionId);

        // 최초 호출 이후, 일정 시간 대기 후 강제 집계
        if (finishCalls.size() == 1) {
            log.info("{}번 방에서 집계 요청", roomId);
            executor.schedule(() -> aggregateAndSendToUser(roomId, session), 4, TimeUnit.SECONDS);
        } else if (finishCalls.size() == currentSessionUserCnt) {
            aggregateAndSendToUser(roomId, session);
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
        Message endMessage = new Message("server", 0, "people", VotingStatus.EXILE, 0);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
    }

    @Override
    public void disconnectSession(String sessionId) {
        WebSocketUser webSocketUser = sessionMapper.get(sessionId);
        if (webSocketUser == null) {
            log.warn("cannot find webSocketUser");
            return;
        }
        VotingSession targetRoomSessionStatus = votingSessions.get(webSocketUser.getRoomId());
        // 해당 유저와 관련된 투표 세션이 있다면 정리해줌
        if (targetRoomSessionStatus != null) {
            HashSet<String> users = targetRoomSessionStatus.getUsers();
            users.remove(sessionId);
            // 투표 세션에 참여중인 유저의 연결이 모두 끊어지면 투표 세션 자체를 없애버림
            if (users.isEmpty()) {
                votingSessions.remove(webSocketUser.getRoomId());
            } else {
                Message disconnectionMessage = new Message("server", 0, "people", VotingStatus.DISCONNECT, getUserNicknamesFromUserList(users));
                simpMessagingTemplate.convertAndSend("/voting/" + webSocketUser.getRoomId(), disconnectionMessage);
                // 방장의 연결이 끊긴 경우 권한 위임
                boolean isVotingCaller = webSocketUser.getId() == targetRoomSessionStatus.getVotingCaller();
                if (isVotingCaller) {
                    String someoneInRoom = users.stream().findFirst().orElse(null);
                    long someonesId = sessionMapper.get(someoneInRoom).getId();
                    targetRoomSessionStatus.setVotingCaller(someonesId);
                    Message promotionMessage = new Message("server", 0, "person", VotingStatus.PROMOTION, getUserNicknamesFromUserList(users));
                    simpMessagingTemplate.convertAndSendToUser(someonesId + "", "/private", promotionMessage);
                }
            }
        }
        // 연결이 끊긴 유저의 세션 정리
        sessionMapper.remove(sessionId);
        log.info("Session disconnected : {}", sessionId);
    }

    private List<WebSocketUser> getUserNicknamesFromUserList(HashSet<String> users) {
        return users.stream()
                .map(sessionMapper::get)
                .collect(Collectors.toList());
    }

    private void aggregateAndSendToUser(long roomId, VotingSession session) {
        HashMap<Long, Integer> votingStatus = session.getAggregation();
        if (!votingStatus.isEmpty()) {
            long todayPickMenuId = Collections.max(votingStatus.entrySet(), Map.Entry.comparingByValue()).getKey();
            menuService.insertTodayPick(roomId, todayPickMenuId);
            Menu todayPick = menuService.getMenuById(todayPickMenuId);
            // 집계 결과 송출
            Message endMessage = new Message("server", 0, "people", VotingStatus.FINISH, todayPick);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
        } else {
            // 아무도 투표하지 않음.
            Message endMessage = new Message("server", 0, "people", VotingStatus.FAIL, 0);
            simpMessagingTemplate.convertAndSend("/voting/" + roomId, endMessage);
        }
        // session cleanup
        votingSessions.remove(roomId);
    }
}
