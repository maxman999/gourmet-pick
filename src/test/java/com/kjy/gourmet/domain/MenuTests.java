package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.MenuMapper;
import com.kjy.gourmet.mapper.RoomMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Comparator;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest
public class MenuTests {

    @Autowired
    RoomMapper roomMapper;
    @Autowired
    MenuMapper menuMapper;

    @BeforeEach
    public void setUp() {
        Room room = Room.builder()
                .name("점심책임방")
                .invitationCode("123ZXCa")
                .build();
        roomMapper.insertRoom(room);
        for (int i = 0; i < 2; i++) {
            Menu menu = Menu.builder()
                    .roomId(room.getId())
                    .name("명가 돌솥 설렁탕" + i)
                    .thumbnail("test" + i)
                    .build();
            menuMapper.insertMenu(menu);
        }
    }

    @AfterEach
    public void cleanUp() {
        menuMapper.deleteAllMenu();
        roomMapper.deleteAllRoom();
    }

    @Test
    public void selectMenuByRoomIdTest() {
        long roomId = roomMapper.selectRoomByCode("123ZXCa").getId();
        List<Menu> menuList = menuMapper.selectMenuList(roomId);
        menuList.sort(Comparator.comparingLong(Menu::getId));
        for (int i = 0; i < 2; i++) {
            assertThat(menuList.get(i).getName()).isEqualTo("명가 돌솥 설렁탕" + i);
        }
    }
}
