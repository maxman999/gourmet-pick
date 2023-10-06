package com.kjy.gourmet.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.HashSet;

@Getter
@AllArgsConstructor
public class SessionStatus {
    private HashSet<String> users;
    private HashMap<String, Integer> votingStatus;
}

