package com.kjy.gourmet.domain.dto;

import lombok.*;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private VotingStatus status;
    private Object data;
}
