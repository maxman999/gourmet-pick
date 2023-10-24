package com.kjy.gourmet.domain.room;

import com.kjy.gourmet.domain.menu.Menu;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Room {
    private long id;
    private String name;
    private String invitationCode;
    private long managerId;
    private Menu todayPick;

    private boolean hasVotingSession;
    private int currentVotingUserCnt;
}
