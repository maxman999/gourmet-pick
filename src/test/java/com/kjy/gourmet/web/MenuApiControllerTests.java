package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.room.RoomService;
import com.google.gson.Gson;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.utils.TestUtils;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MenuApiControllerTests {

    @Autowired
    private WebApplicationContext ctx;
    @Autowired
    private UserService userService;
    @Autowired
    private RoomService roomService;
    @Autowired
    private MenuService menuService;

    private MockMvc mockMvc;
    Gson gson = new Gson();
    User dummyUser;
    Room dummyRoom;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
        User newbie = TestUtils.getDummyUser();
        userService.signUpOrUpdateUser(newbie);
        dummyUser = userService.getUserByEmail(newbie.getEmail());
        Room newRoom = TestUtils.getDummyRoom(dummyUser.getId());
        dummyRoom = roomService.makeRoom(newRoom.getName(), dummyUser.getId());
    }

    @AfterEach
    public void cleanUp() {
        userService.signOutById(dummyUser.getId());
        roomService.deleteRoomById(dummyRoom.getId());
        List<Menu> menuList = menuService.getMenuList(dummyRoom.getId());
        menuList.forEach(menu -> {
            menuService.deleteMenu(menu.getId());
        });

    }

    @Test
    public void addMenuTest() throws Exception {
        Menu menu = TestUtils.getDummyMenu(dummyRoom.getId(), dummyUser.getId());
        String menuJson = gson.toJson(menu);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/menu/insert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(menuJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }

    @Test
    public void getMenuListTest() throws Exception {
        Menu menu = TestUtils.getDummyMenu(dummyRoom.getId(), dummyUser.getId());
        menuService.insertMenu(menu);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/menu/" + dummyRoom.getId()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }

    @Test
    public void deleteMenuTest() {
        Menu newMenu = TestUtils.getDummyMenu(dummyRoom.getId(), dummyUser.getId());
        menuService.insertMenu(newMenu);
        List<Menu> menuList = menuService.getMenuList(dummyRoom.getId());
        menuList.forEach(menu -> {
            try {
                mockMvc.perform(MockMvcRequestBuilders.delete("/api/menu/" + menu.getId()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

    }
}
