package com.kjy.gourmet.service.room;

import com.kjy.gourmet.domain.room.Room;

import java.util.List;
import java.util.Map;

public interface RoomService {
    Room makeRoom(String roomName, long managerId);

    int deleteRoomById(long roomId);

    Room getRoomById(long roomId);

    Room getRoomByCode(String invitationCode);

    int enterRoom(long userId, long roomId);

    int exitRoom(long userId, long roomId);

    List<Room> getMyRoomList(long userId);

    int modifyRoomName(long roomId, String roomName);

    Map<String, Object> enterRoomWithInspection(long roomId, String roomCode, String sessionId);

    int getCurrentRoomMenuCount(long roomId);
}
