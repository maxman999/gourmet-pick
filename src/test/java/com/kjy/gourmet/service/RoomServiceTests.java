package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.service.room.RoomService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
public class RoomServiceTests {

    @Autowired
    UserService userService;
    @Autowired RoomService roomService;

    List<String> invitationCodes = new ArrayList<>();

    @BeforeEach
    public void setUp(){
        User newbie = User.builder()
                .email("test1@naver.com")
                .nickname("고든램지")
                .role(Role.USER)
                .build();
        userService.signUp(newbie);

        for(int i = 0; i < 2; i++){
            Room room = Room.builder()
                    .name("점심책임방"+i)
                    .invitationCode("123ZXCa"+i)
                    .build();
            invitationCodes.add(room.getInvitationCode());
            roomService.makeRoom(room);
        }
    }

    @AfterEach
    public void cleanUp(){
        long memId = userService.getUserByEmail("test1@naver.com").getId();
        for(int i = 0; i < 2; i++){
            long roomId = roomService.getRoomByCode("123ZXCa"+i).getId();
            roomService.exitRoom(memId,roomId);
            roomService.deleteRoomById(roomId);
        }
        userService.signOut(memId);
    }
    @Test
    public void getRoomTest(){
        for(int i = 0; i < 2; i++){
            String roomName = roomService.getRoomByCode(invitationCodes.get(i)).getName();
            assertThat(roomName).isEqualTo("점심책임방"+i);
        }
    }
    @Test
    public void enterRoomTest(){
        long userId = userService.getUserByEmail("test1@naver.com").getId();
        for(int i = 0; i < 2; i++){
            long roomId = roomService.getRoomByCode("123ZXCa"+i).getId();
            roomService.enterRoom(userId, roomId);
        }
        List<Room> myRoomList = roomService.getMyRoomList(userId);
        for(int i = 0; i < 2; i++){
            String roomName = myRoomList.get(i).getName();
            assertThat(roomName).isEqualTo("점심책임방"+i);
        }
    }
}
