package com.kjy.gourmet.web;

import com.google.gson.Gson;
import com.kjy.gourmet.domain.user.User;
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

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserApiControllerTests {

    @Autowired
    private WebApplicationContext ctx;
    @Autowired
    UserService userService;

    private MockMvc mockMvc;
    Gson gson = new Gson();
    User dummyUser = TestUtils.getDummyUser();

    @BeforeEach
    public void setUp() {
        userService.signUpOrUpdateUser(dummyUser);
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
    }

    @AfterEach
    public void cleanUp() {
        User userInDB = userService.getUserByEmail(dummyUser.getEmail());
        if (userInDB != null) userService.signOutById(userInDB.getId());
        this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx).build();
    }

    @Test
    public void signUpTest() throws Exception {
        String newbieJson = gson.toJson(dummyUser);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/signUp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newbieJson))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void getUserTest() throws Exception {
        User user = userService.getUserByEmail(dummyUser.getEmail());
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/user/" + user.getId())
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void signOutTest() throws Exception {
        User user = userService.getUserByEmail(dummyUser.getEmail());
        mockMvc.perform(
                        MockMvcRequestBuilders.delete("/api/user/" + user.getId())
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

}
