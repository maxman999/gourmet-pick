package com.kjy.gourmet.service.room;

import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.RoomMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RoomServiceImpl implements RoomService{

    private final RoomMapper roomMapper;

    @Override
    public int makeRoom(Room room) {
        return roomMapper.insertRoom(room);
    }

    @Override
    public int deleteRoomById(long roomId) {
        return roomMapper.deleteRoomById(roomId);
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
    public int enterRoom(long memberId, long roomId) {
        return roomMapper.insertFavoriteRoom(memberId, roomId);
    }

    @Override
    public int exitRoom(long memberId, long roomId) {
        return roomMapper.deleteFavoriteRoom(memberId, roomId);
    }

    @Override
    public List<Room> getMyRoomList(long memberId) {
        return roomMapper.selectFavoriteRoomList(memberId);
    }

}
