package com.kjy.gourmet.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SessionMapper {
    private long userId;
    private long roomId;
}
