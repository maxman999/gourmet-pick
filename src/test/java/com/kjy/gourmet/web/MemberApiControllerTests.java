package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.mapper.MemberMapper;
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
public class MemberApiControllerTests {

    @Autowired private WebApplicationContext ctx;
    @Autowired private MemberMapper memberMapper;

    private MockMvc mockMvc;
    Gson gson = new Gson();

    @BeforeEach
    public void setUp(){
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
    }

    @Order(1)
    @Test
    public void signUpTest() throws Exception{
        Member newbie = Member.builder()
                .email("test1@naver.com")
                .password("123456")
                .nickname("웹램지")
                .build();
        String newbieJson = gson.toJson(newbie);
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/member/signUp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(newbieJson)

                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }
    @Order(2)
    @Test
    public void getMemberTest() throws Exception{
        long memberId =  memberMapper.selectMemberByEmail("test1@naver.com").getId();
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/member/"+memberId)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andDo(MockMvcResultHandlers.print());
    }
    @Order(3)
    @Test
    public void signOutTest() throws Exception{
        long memberId = memberMapper.selectMemberByEmail("test1@naver.com").getId();

        mockMvc.perform(
                MockMvcRequestBuilders.delete("/api/member/"+memberId)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andDo(MockMvcResultHandlers.print());
    }

}
