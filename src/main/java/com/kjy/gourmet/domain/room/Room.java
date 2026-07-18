package com.kjy.gourmet.domain.room;

import com.kjy.gourmet.domain.menu.Menu;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Room {
    private long id;
    private String name;
    private String invitationCode;
    private long managerId;
    private Menu todayPick;

    @Setter
    private boolean hasVotingSession;
    @Setter
    private int currentVotingUserCnt;
}
