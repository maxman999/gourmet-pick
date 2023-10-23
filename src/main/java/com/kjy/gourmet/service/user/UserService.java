package com.kjy.gourmet.service.user;

import com.kjy.gourmet.domain.user.User;

public interface UserService {
    int signUp(User user);

    int signUpOrUpdateUser(User user);

    int updateNickname(long userId, String nickname);

    int signOutById(long userId);

    int signOutByEmail(String email);

    User getUserById(long userId);

    User getUserByEmail(String email);
}
