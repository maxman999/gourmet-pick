package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.mapper.UserMapper;
import com.kjy.gourmet.utils.TestUtils;
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

    User dummyUser = TestUtils.getDummyUser();

    @BeforeEach
    public void setUp() {
        userMapper.insertOrUpdateUser(dummyUser);
    }

    @AfterEach
    public void cleanUp() {
        User user = userMapper.selectUserByEmail(dummyUser.getEmail());
        userMapper.deleteUserById(user.getId());
    }

    @Test
    public void selectUserByEmailTest() {
        User user = userMapper.selectUserByEmail(dummyUser.getEmail());
        assertThat(user.getNickname()).isEqualTo(dummyUser.getNickname());
    }

}
