package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.menu.MenuService;
import com.kjy.gourmet.service.room.RoomService;
import com.google.gson.Gson;
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

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MenuApiControllerTests {

    @Autowired
    private WebApplicationContext ctx;
    @Autowired
    private RoomService roomService;
    @Autowired
    private MenuService menuService;

    private MockMvc mockMvc;
    Gson gson = new Gson();

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
        roomService.makeRoom("점심책임방");
    }

    @AfterEach
    public void cleanUp() {
        long roomId = roomService.getRoomByCode("123ZXCa").getId();
        roomService.deleteRoomById(roomId);
    }


    @Test
    public void menuManagementTest() throws Exception {
        long roomId = roomService.getRoomByCode("123ZXCa").getId();
        long menuId;
        Menu menu = Menu.builder()
                .roomId(roomId)
                .name("명가 돌솥 설렁탕")
                .build();
        String menuJson = gson.toJson(menu);
        // add menu
        mockMvc.perform(MockMvcRequestBuilders.post("/api/menu/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(menuJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        // get menuList
        mockMvc.perform(MockMvcRequestBuilders.get("/api/menu/" + roomId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        // delete menu
        menuId = menuService.getMenuList(roomId).get(0).getId();
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/menu/" + menuId));
    }


}
