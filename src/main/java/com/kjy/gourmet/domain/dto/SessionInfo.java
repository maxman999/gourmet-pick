package com.kjy.gourmet.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class SessionInfo {
    private String userId;
    private String roomId;
}
