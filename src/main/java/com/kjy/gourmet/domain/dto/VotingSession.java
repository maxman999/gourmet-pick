package com.kjy.gourmet.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.HashSet;

@Getter
@NoArgsConstructor
public class VotingSession {
    private final HashSet<String> users = new HashSet<>();
    private final HashMap<String, Integer> aggregation = new HashMap<>();
    private final HashSet<String> finishCalls = new HashSet<>();
}

