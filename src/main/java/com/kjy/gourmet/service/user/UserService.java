package com.kjy.gourmet.service.user;

import com.kjy.gourmet.domain.user.User;

public interface UserService {

    int signUpOrUpdateUser(User user);

    int updateNickname(long userId, String nickname);

    int signOutById(long userId);

    User getUserById(long userId);

    User getUserByEmail(String email);
}
