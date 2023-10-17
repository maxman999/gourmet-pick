package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.room.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/room")
@RequiredArgsConstructor
@RestController
public class RoomApiController {

    private final RoomService roomService;

    @PostMapping("/make")
    public int makeRoom(@RequestBody Room room){
        return roomService.makeRoom(room);
    }

    @GetMapping("/{invitationCode}")
    public Room getRoom(@PathVariable("invitationCode") String invitationCode){
        return roomService.getRoomByCode(invitationCode);
    }

    @DeleteMapping("/{roomId}")
    public int deleteRoom(@PathVariable("roomId") long roomId){
        return roomService.deleteRoomById(roomId);
    }

    @PostMapping("/enter/{userId}/{roomId}")
    public int enterRoom(@PathVariable("userId") long userId,
                         @PathVariable("roomId") long roomId){
        return roomService.enterRoom(userId,roomId);
    }

    @PostMapping("/exit/{userId}/{roomId}")
    public int exitRoom(@PathVariable("userId") long userId,
                        @PathVariable("roomId") long roomId){
        return roomService.exitRoom(userId, roomId);
    }

    @GetMapping("/getList")
    public List<Room> getMyRoomList(@RequestParam("userId") long userId){
        return roomService.getMyRoomList(userId);
    }

    @DeleteMapping("/remove/{roomId}")
    public int removeRoom(@PathVariable("roomId") long roomId){
        return roomService.deleteRoomById(roomId);
    }
}
