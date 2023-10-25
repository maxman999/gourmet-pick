package com.kjy.gourmet.mapper;

import com.kjy.gourmet.domain.room.Room;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Mapper
public interface RoomMapper {
    int insertRoom(Room room);

    Room selectRoomByCode(String invitationCode);

    Room selectRoomById(long id);

    int deleteRoomById(long roomId);

    int insertFavoriteRoom(@Param("userId") long userId, @Param("roomId") long roomId);

    List<Room> selectFavoriteRoomList(long userId);

    int deleteFavoriteRoom(@Param("userId") long userId, @Param("roomId") long roomId);

    int modifyRoomName(@Param("roomId") long roomId, @Param("roomName") String roomName);

    int getCurrentRoomMenuCount(long roomId);

    int deleteAllRoom();

    int deleteAllRoomFavorites();

}
