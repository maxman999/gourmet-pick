package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.service.room.RoomService;
import com.kjy.gourmet.utils.TestUtils;
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
    @Autowired
    RoomService roomService;

    User dummyUser;
    List<Room> dummyRoomList = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        User newbie = TestUtils.getDummyUser();
        userService.signUpOrUpdateUser(newbie);
        dummyUser = newbie;

        User userInDB = userService.getUserByEmail(newbie.getEmail());
        for (int i = 0; i < 2; i++) {
            Room newRoom = TestUtils.getDummyRoom(userInDB.getId());
            Room roomInDB = roomService.makeRoom(newRoom.getName(), userInDB.getId());
            dummyRoomList.add(roomInDB);
        }
    }

    @AfterEach
    public void cleanUp() {
        User user = userService.getUserByEmail(dummyUser.getEmail());
        dummyRoomList.forEach(room -> {
            roomService.exitRoom(user.getId(), room.getId());
            roomService.deleteRoomById(room.getId());
        });
        userService.signOutById(user.getId());
    }

    @Test
    public void getRoomTest() {
        dummyRoomList.forEach(room -> {
            Room roomInDB = roomService.getRoomByCode(room.getInvitationCode());
            assertThat(roomInDB.getName()).isEqualTo(room.getName());
        });
    }

    @Test
    public void enterRoomTest() {
        User user = userService.getUserByEmail(dummyUser.getEmail());
        dummyRoomList.forEach(room -> roomService.enterRoom(user.getId(), room.getId()));

        List<Room> myRoomList = roomService.getMyRoomList(user.getId());
        for (int i = 0; i < myRoomList.size(); i++) {
            assertThat(myRoomList.get(i).getName()).isEqualTo(dummyRoomList.get(i).getName());
        }
    }

    @Test
    public void modifyRoomNameTest() {
        dummyRoomList.forEach(room -> {
            roomService.modifyRoomName(room.getId(), "newName");
            String modifiedRoomName = roomService.getRoomByCode(room.getInvitationCode()).getName();
            assertThat(modifiedRoomName).isEqualTo("newName");
        });
    }
}
