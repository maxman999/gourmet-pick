package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.service.room.RoomService;
import com.google.gson.Gson;
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
public class RoomApiControllerTests {

    @Autowired
    private WebApplicationContext ctx;
    @Autowired
    private UserService userService;
    @Autowired
    private RoomService roomService;

    private MockMvc mockMvc;
    Gson gson = new Gson();
    User dummyUser = TestUtils.getDummyUser();
    Room dummyRoom;

    @BeforeEach
    public void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
        userService.signUpOrUpdateUser(dummyUser);
        dummyUser = userService.getUserByEmail(dummyUser.getEmail());
        Room newRoom = TestUtils.getDummyRoom(dummyUser.getId());
        dummyRoom = roomService.makeRoom(newRoom.getName(), dummyUser.getId());
    }

    @AfterEach
    public void cleanUp() {
        userService.signOutById(dummyUser.getId());
        List<Room> myRoomList = roomService.getMyRoomList(dummyUser.getId());
        myRoomList.forEach(room -> {
            roomService.exitRoom(dummyUser.getId(), room.getId());
            roomService.deleteRoomById(room.getId());
        });
    }

    @Test
    public void makeRoomTest() throws Exception {
        dummyRoom = TestUtils.getDummyRoom(dummyUser.getId());
        String roomJson = gson.toJson(dummyRoom);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/room/make")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(roomJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void lookupRoomTest() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/room/" + dummyRoom.getName())
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void enterRoomTest() throws Exception {
        String enterUrl = "/api/room/enter/" + dummyUser.getId() + "/" + dummyRoom.getId();
        mockMvc.perform(MockMvcRequestBuilders.post(enterUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void modifyRoomNameTest() throws Exception {
        Room newRoom = Room.builder().name("newName").id(dummyRoom.getId()).build();
        String newRoomJson = gson.toJson(newRoom);
        String modificationUrl = "/api/room/modifyRoomName";
        mockMvc.perform(MockMvcRequestBuilders.post(modificationUrl)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newRoomJson)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void getMyRoomListTest() throws Exception {
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/room/getMyRoomList" + dummyUser.getId())
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void exitRoomTest() throws Exception {
        roomService.enterRoom(dummyUser.getId(), dummyRoom.getId());
        String exitUrl = "/api/room/exit/" + dummyUser.getId() + "/" + dummyRoom.getId();
        mockMvc.perform(MockMvcRequestBuilders.delete(exitUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void removeRoomTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/room/" + dummyRoom.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }
}
