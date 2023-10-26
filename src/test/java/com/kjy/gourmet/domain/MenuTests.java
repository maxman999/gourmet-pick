package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.mapper.MenuMapper;
import com.kjy.gourmet.mapper.RoomMapper;
import com.kjy.gourmet.mapper.UserMapper;
import com.kjy.gourmet.utils.TestUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
public class MenuTests {

    @Autowired
    UserMapper userMapper;
    @Autowired
    RoomMapper roomMapper;
    @Autowired
    MenuMapper menuMapper;

    User dummyUser;
    Room dummyRoom;
    List<Menu> dummyMenuList = new ArrayList<>();


    @BeforeEach
    public void setUp() {
        User user = TestUtils.getDummyUser();
        userMapper.insertOrUpdateUser(user);
        dummyUser = user;

        Room room = TestUtils.getDummyRoom(user.getId());
        roomMapper.insertRoom(room);
        dummyRoom = room;

        User userInDB = userMapper.selectUserByEmail(user.getEmail());
        for (int i = 0; i < 2; i++) {
            Menu menu = TestUtils.getDummyMenu(room.getId(), userInDB.getId());
            menuMapper.insertMenu(menu);
            dummyMenuList.add(menu);
        }
    }

    @AfterEach
    public void cleanUp() {
        List<Menu> menuList = menuMapper.selectMenuList(dummyRoom.getId());
        menuList.forEach(menu -> {
            menuMapper.deleteMenu(menu.getId());
        });
        roomMapper.deleteRoomById(dummyRoom.getId());
        User userInDB = userMapper.selectUserByEmail(dummyUser.getEmail());
        userMapper.deleteUserById(userInDB.getId());
    }

    @Test
    public void selectMenuByRoomIdTest() {
        List<Menu> menuList = menuMapper.selectMenuList(dummyRoom.getId());
        for (int i = 0; i < menuList.size(); i++) {
            assertThat(menuList.get(i).getName()).isEqualTo(dummyMenuList.get(i).getName());
        }
    }
}
