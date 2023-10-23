package com.kjy.gourmet.web.dto;

import com.kjy.gourmet.domain.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class WebSocketUser {
    private long id;
    private long roomId;
    private String nickname;

    public WebSocketUser(User user) {
        this.id = user.getId();
        this.nickname = user.getNickname();
    }
}
