package com.kjy.gourmet.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.HashSet;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VotingSession {
    private HashSet<String> users = new HashSet<>();
    private HashMap<String, Integer> aggregation = new HashMap<>();
    private HashSet<String> finishCalls = new HashSet<>();

    public VotingSession(String users) {
        this.users.add(users);
    }

}
