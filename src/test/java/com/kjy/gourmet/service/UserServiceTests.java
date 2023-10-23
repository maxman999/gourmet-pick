package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserServiceTests {

    @Autowired
    UserService userService;

    @BeforeEach
    public void setUp() {
        User newbie = User.builder()
                .email("test1@naver.com")
                .nickname("김램지")
                .role(Role.USER)
                .build();
        int procRes = userService.signUp(newbie);
        assertThat(procRes).isEqualTo(1);
    }

    @AfterEach
    public void cleanUp() {
        long memId = userService.getUserByEmail("test1@naver.com").getId();
        int procRes = userService.signOutById(memId);
        assertThat(procRes).isEqualTo(1);
    }

    @Test
    public void getUserTest() {
        long memId = userService.getUserByEmail("test1@naver.com").getId();
        User user = userService.getUserById(memId);
        assertThat(user.getNickname()).isEqualTo("김램지");
    }

    @Test
    public void signUpOrUpdateUserTest() {
        User updatedUser = User.builder()
                .email("test1@naver.com")
                .nickname("백종원")
                .role(Role.GUEST)
                .build();
        userService.signUpOrUpdateUser(updatedUser);
        User user = userService.getUserByEmail("test1@naver.com");
        assertThat(user.getNickname()).isEqualTo("백종원");
        assertThat(user.getRoleKey()).isEqualTo("ROLE_GUEST");
    }
}
