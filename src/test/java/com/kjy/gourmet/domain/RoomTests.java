package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.MenuMapper;
import com.kjy.gourmet.mapper.UserMapper;
import com.kjy.gourmet.mapper.RoomMapper;
import com.kjy.gourmet.utils.TestUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
public class RoomTests {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RoomMapper roomMapper;
    @Autowired
    private MenuMapper menuMapper;

    User dummyUser = TestUtils.getDummyUser();
    List<Room> dummyRoomList = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        userMapper.insertOrUpdateUser(dummyUser);
        User userInDB = userMapper.selectUserByEmail(dummyUser.getEmail());
        for (int i = 0; i < 2; i++) {
            Room room = TestUtils.getDummyRoom(userInDB.getId());
            roomMapper.insertRoom(room);
            dummyRoomList.add(room); // room에 id 추가됨
        }
    }

    @AfterEach
    public void cleanUp() {
        dummyRoomList.forEach(room -> {
            roomMapper.deleteFavoriteRoom(dummyUser.getId(), room.getId());
            roomMapper.deleteRoomById(roomMapper.selectRoomByCode(room.getInvitationCode()).getId());
        });
        userMapper.deleteUserById(dummyUser.getId());
    }

    @Test
    public void selectRoomByCodeTest() {
        dummyRoomList.forEach(room -> {
            Room roomInDB = roomMapper.selectRoomById(room.getId());
            assertThat(roomInDB.getName()).isEqualTo(room.getName());
        });
    }

    @Test
    public void insertFavoriteRoomTest() {
        User user = userMapper.selectUserByEmail(dummyUser.getEmail());
        this.dummyRoomList.forEach(room -> roomMapper.insertFavoriteRoom(user.getId(), room.getId()));
        List<Room> favoriteRoomList = roomMapper.selectFavoriteRoomList(user.getId());

        for (int i = 0; i < favoriteRoomList.size(); i++) {
            assertThat(favoriteRoomList.get(i).getName())
                    .isEqualTo(dummyRoomList.get(i).getName());
        }
    }

    @Test
    public void modifyRoomNameTest() {
        dummyRoomList.forEach(room -> {
            roomMapper.modifyRoomName(room.getId(), "newName");
        });

        dummyRoomList.forEach(room -> {
            String modifiedName = roomMapper.selectRoomByCode(room.getInvitationCode()).getName();
            assertThat(modifiedName).isEqualTo("newName");
        });
    }

    @Test
    public void insertTodayPickTest() {
        User user = userMapper.selectUserByEmail(dummyUser.getEmail());
        dummyRoomList.forEach(room -> {
            Menu menu = TestUtils.getDummyMenu(room.getId(), user.getId());
            menuMapper.insertMenu(menu);
            menuMapper.insertTodayPick(room.getId(), menu.getId());
            Room roomAfterInsertTodayPick = roomMapper.selectRoomByCode(room.getInvitationCode());
            assertThat(roomAfterInsertTodayPick.getTodayPick().getId()).isEqualTo(menu.getId());

            menuMapper.deleteTodayPick(room.getId());
            Room roomAfterTodayPickDelete = roomMapper.selectRoomByCode(room.getInvitationCode());
            assertThat(roomAfterTodayPickDelete.getTodayPick().getId()).isNotEqualTo(menu.getId());
        });
    }
}
