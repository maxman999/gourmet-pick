package com.kjy.gourmet.domain.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Member {
    private long id;
    private String email;
    private String password;
    private String nickname;
}
