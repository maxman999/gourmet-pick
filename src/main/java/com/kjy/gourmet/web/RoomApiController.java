package com.kjy.gourmet.web;

import com.kjy.gourmet.config.auth.LoginUser;
import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.room.RoomService;
import com.kjy.gourmet.service.voting.VotingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/room")
@RequiredArgsConstructor
@RestController
public class RoomApiController {

    private final RoomService roomService;
    private final VotingService votingService;

    @PostMapping("/make")
    public String makeRoom(@RequestBody Room room) {
        return roomService.makeRoom(room.getName(), room.getManagerId()).getInvitationCode();
    }

    @GetMapping("/{invitationCode}")
    public Room getRoom(@PathVariable("invitationCode") String invitationCode) {
        return roomService.getRoomByCode(invitationCode);
    }

    @DeleteMapping("/{roomId}")
    public int deleteRoom(@PathVariable("roomId") long roomId) {
        return roomService.deleteRoomById(roomId);
    }

    @PostMapping("/enter/{userId}/{roomId}")
    public int enterRoom(@PathVariable("userId") long userId,
                         @PathVariable("roomId") long roomId) {
        return roomService.enterRoom(userId, roomId);
    }

    @PostMapping("/enterWithInspection/{userId}/{roomCode}")
    public Map<String, Object> enterWithInspection(@PathVariable("userId") long userId,
                                                   @PathVariable("roomCode") String roomCode,
                                                   @LoginUser SessionUser user) {
        return roomService.enterRoomWithInspection(userId, roomCode, user.getEmail());
    }


    @DeleteMapping("/exit/{userId}/{roomId}")
    public int exitRoom(@PathVariable("userId") long userId,
                        @PathVariable("roomId") long roomId) {
        return roomService.exitRoom(userId, roomId);
    }

    @GetMapping("/getMyRoomList")
    public List<Room> getMyRoomList(@RequestParam("userId") long userId) {
        return votingService.setCurrentVotingSessionStatus(roomService.getMyRoomList(userId));
    }

    @PostMapping("/modifyRoomName")
    public int modifyRoomName(@RequestBody Room nameUpdatedRoom) {
        return roomService.modifyRoomName(nameUpdatedRoom.getId(), nameUpdatedRoom.getName());
    }

    @GetMapping("/menuCount/{roomId}")
    public int getMenuCount(@PathVariable("roomId") long roomId) {
        return roomService.getCurrentRoomMenuCount(roomId);
    }
}
