package com.kjy.gourmet.domain.room;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Room {
    private long id;
    private String name;
    private String invitationCode;

    private boolean hasVotingSession;
    private int currentVotingUserCnt;
}
