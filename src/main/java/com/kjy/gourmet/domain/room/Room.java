package com.kjy.gourmet.domain.room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Room {
    private long id;
    private String name;
    private String invitationCode;
}
