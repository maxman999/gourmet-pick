package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.MenuMapper;
import com.kjy.gourmet.mapper.UserMapper;
import com.kjy.gourmet.mapper.RoomMapper;
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

    List<String> invitationCodes = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        User newbie = User.builder()
                .email("test1@naver.com")
                .nickname("고든램지")
                .role(Role.USER)
                .build();
        userMapper.insertUser(newbie);

        for (int i = 0; i < 2; i++) {
            Room room = Room.builder()
                    .name("점심책임방" + i)
                    .invitationCode("123ZXCa" + i)
                    .build();
            roomMapper.insertRoom(room);
            this.invitationCodes.add(room.getInvitationCode());
        }
    }

    @AfterEach
    public void cleanUp() {
        roomMapper.deleteAllRoomFavorites();
        roomMapper.deleteAllRoom();
        long id = userMapper.selectUserByEmail("test1@naver.com").getId();
        userMapper.deleteUserById(id);
    }

    @Test
    public void selectRoomByCodeTest() {
        Room room = roomMapper.selectRoomByCode("123ZXCa0");
        assertThat(room.getName()).isEqualTo("점심책임방0");
    }

    @Test
    public void insertFavoriteRoomTest() {
        User user = userMapper.selectUserByEmail("test1@naver.com");
        this.invitationCodes.forEach(code -> {
            Room room = roomMapper.selectRoomByCode(code);
            roomMapper.insertFavoriteRoom(user.getId(), room.getId());
        });
        List<Room> favoriteRoomList = roomMapper.selectFavoriteRoomList(user.getId());
        for (int i = 0; i < 2; i++) {
            assertThat(favoriteRoomList.get(i).getName()).isEqualTo("점심책임방" + i);
        }
    }

    @Test
    public void modifyRoomNameTest() {
        Room room = roomMapper.selectRoomByCode("123ZXCa0");
        roomMapper.modifyRoomName(room.getId(), "계란빵방");
        String modifiedName = roomMapper.selectRoomByCode("123ZXCa0").getName();
        assertThat(modifiedName).isEqualTo("계란빵방");
    }

    @Test
    public void insertTodayPickTest() {
        Room room = roomMapper.selectRoomByCode("123ZXCa0");
        Menu menu = Menu.builder()
                .roomId(room.getId())
                .name("명가 돌솥 설렁탕")
                .thumbnail("test")
                .soberComment("냉맛평")
                .latitude(123.12345)
                .longitude(123.1234)
                .build();
        menuMapper.insertMenu(menu);
        menuMapper.insertTodayPick(room.getId(), menu.getId());
        Room roomAfterInsertTodayPick = roomMapper.selectRoomByCode("123ZXCa0");
        assertThat(roomAfterInsertTodayPick.getTodayPick().getId()).isEqualTo(menu.getId());

        menuMapper.deleteTodayPick(room.getId());
        Room roomAfterTodayPickDelete = roomMapper.selectRoomByCode("123ZXCa0");
        assertThat(roomAfterTodayPickDelete.getTodayPick().getId()).isNotEqualTo(menu.getId());
    }
}
