package com.kjy.gourmet.service.room;

import com.kjy.gourmet.domain.dto.VotingSession;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.RoomMapper;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.voting.VotingService;
import com.kjy.gourmet.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RequiredArgsConstructor
@Service
public class RoomServiceImpl implements RoomService {

    private final RoomMapper roomMapper;
    private final VotingService votingService;
    private final MenuService menuService;

    @Override
    public Room makeRoom(String roomName) {
        String newInvitationCode = AuthUtil.generateInviteCode(10);
        Room newRoom = Room.builder()
                .invitationCode(newInvitationCode)
                .name(roomName)
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

}
