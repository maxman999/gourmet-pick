package com.kjy.gourmet.config.auth.dto;

import com.kjy.gourmet.domain.user.Role;
import com.kjy.gourmet.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;

@AllArgsConstructor
@Getter
public class SessionUser implements Serializable {
    private final String email;
    private final String nickname;
    private final Role role;

    public SessionUser(User user) {
        this.nickname = user.getNickname();
        this.email = user.getEmail();
        this.role = user.getRole();
    }
}
