package com.kjy.gourmet.service.voting.dto;

import lombok.Getter;

@Getter
public class Ballot {
    private long menuId;
    private String menuName;
    private String senderName;
    private int preference;
}
