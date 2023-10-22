package com.kjy.gourmet.domain.dto;

import lombok.Getter;

@Getter
public class Ballot {
    private long menuId;
    private String menuName;
    private String senderName;
    private int preference;
}
