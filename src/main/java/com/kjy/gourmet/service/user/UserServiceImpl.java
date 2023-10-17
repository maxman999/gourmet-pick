package com.kjy.gourmet.service.user;

import com.kjy.gourmet.domain.user.User;
import com.kjy.gourmet.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    public int signUpOrUpdateUser(User user) {
        return userMapper.insertOrUpdateUser(user);
    }

    @Override
    public int signUp(User user) {
        return userMapper.insertUser(user);
    }

    @Override
    public int signOut(long userId) {
        return userMapper.deleteUserById(userId);
    }

    @Override
    public User getUserById(long userId) {
        return userMapper.selectUserById(userId);
    }

    @Override
    public User getUserByEmail(String email) {
        return userMapper.selectUserByEmail(email);
    }
}
