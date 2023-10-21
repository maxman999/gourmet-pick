package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.mapper.UserMapper;
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
public class UserApiControllerTests {

    @Autowired private WebApplicationContext ctx;
    @Autowired private UserMapper userMapper;

    private MockMvc mockMvc;Gson gson = new Gson();

    @BeforeEach
    public void setUp(){
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
    }

    @Order(1)
    @Test
    public void signUpTest() throws Exception{
        User newbie = User.builder()
                .email("test1@naver.com")
                .nickname("웹램지")
                .role(Role.USER)
                .build();
        String newbieJson = gson.toJson(newbie);
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/api/user/signUp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(newbieJson)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Order(2)
    @Test
    public void getUserTest() throws Exception{
        long userId =  userMapper.selectUserByEmail("test1@naver.com").getId();
        mockMvc.perform(
            MockMvcRequestBuilders.get("/api/user/"+userId)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andDo(MockMvcResultHandlers.print());
    }

    @Order(3)
    @Test
    public void signOutTest() throws Exception{
        long userId = userMapper.selectUserByEmail("test1@naver.com").getId();

        mockMvc.perform(
                MockMvcRequestBuilders.delete("/api/user/"+userId)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andDo(MockMvcResultHandlers.print());
    }

}
