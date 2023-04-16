package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.service.member.MemberService;
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

    @Autowired private WebApplicationContext ctx;
    @Autowired private MemberService memberService;
    @Autowired private RoomService roomService;

    private MockMvc mockMvc;
    Gson gson = new Gson();

    @BeforeEach
    public void setUp(){
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();

        Member newbie = Member.builder()
                .email("roomApiTest@naver.com")
                .password("123456")
                .nickname("김램지")
                .build();
        memberService.signUp(newbie);
    }

    @AfterEach
    public void cleanUp(){
        long memberId = memberService.getMemberByEmail("roomApiTest@naver.com").getId();
        memberService.signOut(memberId);
    }

    @Test
    public void a_roomManagementTest() throws Exception {
        long memberId = memberService.getMemberByEmail("roomApiTest@naver.com").getId();
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
                        MockMvcRequestBuilders.get("/api/room/"+"qwkekd@1")
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        // enter room
        String enterUrl = "/api/room/enter/" + memberId + "/" + roomId;
        mockMvc.perform(MockMvcRequestBuilders.post(enterUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //lookup user's roomList
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/room/getList?memberId="+memberId)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //exit room
        String exitUrl = "/api/room/exit/" + memberId + "/" + roomId;
        mockMvc.perform(MockMvcRequestBuilders.post(exitUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //remove room
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/room/remove/"+roomId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());

    }
}
