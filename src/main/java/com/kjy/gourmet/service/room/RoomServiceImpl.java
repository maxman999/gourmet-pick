package com.kjy.gourmet.service.room;

import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.service.voting.dto.VotingSession;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.RoomMapper;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.voting.VotingService;
import com.kjy.gourmet.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RequiredArgsConstructor
@Service
public class RoomServiceImpl implements RoomService {

    private final RoomMapper roomMapper;
    private final VotingService votingService;
    private final MenuService menuService;

    @Override
    public Room makeRoom(String roomName, long managerId) {
        String newInvitationCode = AuthUtil.generateInviteCode(10);
        Room newRoom = Room.builder()
                .invitationCode(newInvitationCode)
                .name(roomName)
                .managerId(managerId)
                .build();
        roomMapper.insertRoom(newRoom);
        return newRoom;
    }

    @Override
    public int deleteRoomById(long roomId) {
        VotingSession currentVotingSession = votingService.getVotingSessionByRoomId(roomId);
        // 진행 중인 투표 세션이 있을 때는 삭제 불가능
        if (currentVotingSession != null) return -1;
        // 이미지 파일 삭제 비동기 처리를 위해 우선 썸네일 리스트 추출
        List<String> menuImageList = menuService.getAllThumbnailsById(roomId);
        int result = roomMapper.deleteRoomById(roomId);
        if (result == 1) { // 방 삭제 성공 후 후속 처리
            CompletableFuture.runAsync(() -> menuService.removeAllMenuImages(menuImageList));
            votingService.exileAllUsers(roomId);
            return result;
        }
        return 0;
    }

    @Override
    public Room getRoomById(long roomId) {
        return roomMapper.selectRoomById(roomId);
    }

    @Override
    public Room getRoomByCode(String invitationCode) {
        return roomMapper.selectRoomByCode(invitationCode);
    }

    @Override
    public int enterRoom(long userId, long roomId) {
        return roomMapper.insertFavoriteRoom(userId, roomId);
    }

    @Override
    public Map<String, Object> enterRoomWithInspection(long userId, String roomCode, String sessionId) {
        Map<String, Object> resultMap = new HashMap<>();
        if (votingService.isSessionDuplicated(sessionId)) {
            resultMap.put("code", -1);
            resultMap.put("room", null);
            return resultMap;
        }

        Room room = getRoomByCode(roomCode);
        if (room == null) {
            resultMap.put("code", -2);
            resultMap.put("room", null);
            return resultMap;
        }

        if (votingService.isVotingOngoing(room.getId())) {
            resultMap.put("code", -3);
            resultMap.put("room", null);
            return resultMap;
        }

        enterRoom(userId, room.getId());
        resultMap.put("code", 1);
        resultMap.put("room", room);
        return resultMap;
    }

    @Override
    public int exitRoom(long userId, long roomId) {
        return roomMapper.deleteFavoriteRoom(userId, roomId);
    }

    @Override
    public int modifyRoomName(long roomId, String roomName) {
        return roomMapper.modifyRoomName(roomId, roomName);
    }

    @Override
    public List<Room> getMyRoomList(long userId) {
        return roomMapper.selectFavoriteRoomList(userId);
    }

    @Override
    public int getCurrentRoomMenuCount(long roomId) {
        return roomMapper.getCurrentRoomMenuCount(roomId);
    }
}
