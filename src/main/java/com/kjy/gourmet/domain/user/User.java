package com.kjy.gourmet.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class User {
    private long id;
    private String email;
    private String nickname;
    private Role role;

    public User(String email, String nickname, Role role) {
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }
}
