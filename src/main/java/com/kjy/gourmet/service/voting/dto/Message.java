package com.kjy.gourmet.service.voting.dto;

import lombok.*;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Message {
    private String senderName;
    private long senderId;
    private String receiverName;
    private VotingStatus status;
    private Object data;
}
