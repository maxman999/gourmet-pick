package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.service.user.UserService;
import com.kjy.gourmet.utils.TestUtils;
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

    User dummyUser = TestUtils.getDummyUser();

    @BeforeEach
    public void setUp() {
        userService.signUpOrUpdateUser(dummyUser);
    }

    @AfterEach
    public void cleanUp() {
        long memId = userService.getUserByEmail(dummyUser.getEmail()).getId();
        userService.signOutById(memId);
    }

    @Test
    public void getUserTest() {
        long memId = userService.getUserByEmail(dummyUser.getEmail()).getId();
        User user = userService.getUserById(memId);
        assertThat(user.getNickname()).isEqualTo(dummyUser.getNickname());
    }

    @Test
    public void signUpOrUpdateUserTest() {
        User updatedUser = User.builder()
                .email(dummyUser.getEmail())
                .role(Role.GUEST)
                .build();
        userService.signUpOrUpdateUser(updatedUser);
        User user = userService.getUserByEmail(dummyUser.getEmail());
        assertThat(user.getRoleKey()).isEqualTo("ROLE_GUEST");
    }
}
