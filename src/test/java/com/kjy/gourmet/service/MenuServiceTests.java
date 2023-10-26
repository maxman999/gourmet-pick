package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.room.RoomService;
import com.kjy.gourmet.service.user.UserService;
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
public class MenuServiceTests {

    @Autowired
    UserService userService;
    @Autowired
    RoomService roomService;
    @Autowired
    MenuService menuService;

    User dummyUser;
    Room dummyRoom;
    List<Menu> dummyMenuList = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        User user = TestUtils.getDummyUser();
        userService.signUpOrUpdateUser(user);
        dummyUser = userService.getUserByEmail(user.getEmail());
        Room room = TestUtils.getDummyRoom(dummyUser.getId());
        dummyRoom = roomService.makeRoom(room.getName(), dummyUser.getId());

        for (int i = 0; i < 2; i++) {
            Menu menu = TestUtils.getDummyMenu(dummyRoom.getId(), dummyUser.getId());
            menuService.insertMenu(menu);
            dummyMenuList.add(menu);
        }
    }

    @AfterEach
    public void cleanUp() {
        List<Menu> menuList = menuService.getMenuList(dummyRoom.getId());
        menuList.forEach(menu -> menuService.deleteMenu(menu.getId()));
        roomService.deleteRoomById(dummyRoom.getId());
        userService.signOutById(dummyUser.getId());
    }

    @Test
    public void getMenuListTest() {
        List<Menu> menuList = menuService.getMenuList(dummyRoom.getId());
        for (int i = 0; i < menuList.size(); i++) {
            String menuName = menuList.get(i).getName();
            assertThat(menuName).isEqualTo(dummyMenuList.get(i).getName());
        }
    }
}
