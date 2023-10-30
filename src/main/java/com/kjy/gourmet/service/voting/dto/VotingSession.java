package com.kjy.gourmet.service.voting.dto;

import com.kjy.gourmet.domain.menu.Menu;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

@Getter
@NoArgsConstructor
public class VotingSession {
    private final HashSet<String> users = new HashSet<>();
    @Setter
    private List<Menu> todayMenuList = new ArrayList<>();
    private final HashMap<Long, Integer> aggregation = new HashMap<>();
    private final HashSet<String> finishCalls = new HashSet<>();
    @Setter
    private long votingCaller = 0L;
    @Setter
    boolean isVotingOnGoing = false;

}

