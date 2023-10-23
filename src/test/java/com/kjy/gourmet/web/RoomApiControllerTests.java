package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.user.UserService;
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
public class RoomApiControllerTests {

    @Autowired
    private WebApplicationContext ctx;
    @Autowired
    private UserService userService;
    @Autowired
    private RoomService roomService;

    private MockMvc mockMvc;
    Gson gson = new Gson();

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();

        User newbie = User.builder()
                .email("roomApiTest@naver.com")
                .nickname("김램지")
                .role(Role.USER)
                .build();
        userService.signUp(newbie);
    }

    @AfterEach
    public void cleanUp() {
        long userId = userService.getUserByEmail("roomApiTest@naver.com").getId();
        userService.signOutById(userId);
    }

    @Test
    public void roomManagementTest() throws Exception {
        long userId = userService.getUserByEmail("roomApiTest@naver.com").getId();
        long roomId;
        // make room
        Room room = Room.builder()
                .invitationCode("qwkekd@1")
                .name("점책방")
                .build();
        String roomJson = gson.toJson(room);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/room/make")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        roomId = roomService.getRoomByCode("qwkekd@1").getId();
        // lookup room
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/room/" + "qwkekd@1")
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        // enter room
        String enterUrl = "/api/room/enter/" + userId + "/" + roomId;
        mockMvc.perform(MockMvcRequestBuilders.post(enterUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        // modify roomName
        String modificationUrl = "/api/room/modify/" + roomId + "/" + "수정된 방이름";
        mockMvc.perform(MockMvcRequestBuilders.post(modificationUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //lookup user's roomList
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/room/getMyRoomList" + userId)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //exit room
        String exitUrl = "/api/room/exit/" + userId + "/" + roomId;
        mockMvc.perform(MockMvcRequestBuilders.post(exitUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //remove room
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/room/remove/" + roomId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }
}
