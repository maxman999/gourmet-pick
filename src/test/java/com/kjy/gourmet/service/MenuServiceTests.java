package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.room.RoomService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class MenuServiceTests {

    @Autowired
    RoomService roomService;
    @Autowired
    MenuService menuService;

    @BeforeEach
    public void setUp() {
        Room room = roomService.makeRoom("점심책임방");
        for (int i = 0; i < 2; i++) {
            Menu menu = Menu.builder()
                    .roomId(room.getId())
                    .name("명가 돌솥 설렁탕" + i)
                    .build();
            menuService.insertMenu(menu);
        }
    }

    @AfterEach
    public void cleanUp() {
        long roomId = roomService.getRoomByCode("123ZXCa").getId();
        List<Menu> menuList = menuService.getMenuList(roomId);
        for (Menu menu : menuList) {
            long menuId = menu.getId();
            menuService.deleteMenu(menuId);
        }
        roomService.deleteRoomById(roomId);
    }

    @Test
    public void getMenuListTest() {
        long roomId = roomService.getRoomByCode("123ZXCa").getId();
        List<Menu> menuList = menuService.getMenuList(roomId);
        for (int i = 0; i < menuList.size(); i++) {
            String menuName = menuList.get(i).getName();
            assertThat(menuName).isEqualTo("명가 돌솥 설렁탕" + i);
        }
    }
}
