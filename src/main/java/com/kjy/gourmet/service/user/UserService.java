package com.kjy.gourmet.service.user;

import com.kjy.gourmet.domain.user.User;

public interface UserService {
    int signUp(User user);

    int signUpOrUpdateUser(User user);

    int signOut(long userId);

    User getUserById(long userId);

    User getUserByEmail(String email);
}
