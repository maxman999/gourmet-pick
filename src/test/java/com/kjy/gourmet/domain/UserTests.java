package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.mapper.UserMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
public class UserTests {

    @Autowired
    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        User newbie = User.builder()
                .email("test1@naver.com")
                .nickname("고든램지")
                .role(Role.USER)
                .build();
        userMapper.insertUser(newbie);
    }

    @AfterEach
    public void cleanUp() {
        User user = userMapper.selectUserByEmail("test1@naver.com");
        userMapper.deleteUserById(user.getId());
    }

    @Test
    public void selectUserByEmailTest() {
        User user = userMapper.selectUserByEmail("test1@naver.com");
        assertThat(user.getNickname()).isEqualTo("고든램지");
    }

    @Test
    public void insertOrUpdateTest() {
        User updatedUser = User.builder()
                .email("test1@naver.com")
                .nickname("백종원")
                .role(Role.GUEST)
                .build();
        userMapper.insertOrUpdateUser(updatedUser);
        User user = userMapper.selectUserByEmail("test1@naver.com");
        assertThat(user.getNickname()).isEqualTo("백종원");
        assertThat(user.getRoleKey()).isEqualTo("ROLE_GUEST");
    }
}
