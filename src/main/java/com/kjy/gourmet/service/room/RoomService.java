package com.kjy.gourmet.service.room;

import com.kjy.gourmet.domain.room.Room;

import java.util.List;

public interface RoomService {
    int makeRoom(Room room);
    int deleteRoomById(long roomId);
    Room getRoomById(long roomId);
    Room getRoomByCode(String invitationCode);
    int enterRoom(long memberId, long roomId);
    int exitRoom(long memberId, long roomId);
    List<Room> getMyRoomList(long memberId);
}
