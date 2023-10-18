package com.kjy.gourmet.config.auth.dto;

import com.kjy.gourmet.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.Serializable;

@AllArgsConstructor
@Getter
public class SessionUser implements Serializable {
    private final String email;
    private final String nickName;

    public SessionUser(User user) {
        this.nickName = user.getNickname();
        this.email = user.getEmail();
    }
}
