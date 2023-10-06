package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.service.voting.VotingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final VotingService votingService;

    @MessageMapping("/voting/seating/{username}/{roomId}")
    public void seating(@DestinationVariable String roomId, @DestinationVariable String username) {
        votingService.memberSeatingHandler(roomId, username);
    }

    @MessageMapping("/voting/decide/{username}/{roomId}")
    public void decide(
            @DestinationVariable String roomId,
            @DestinationVariable String username,
            Ballot ballot) {
        votingService.decideHandler(roomId,ballot);
    }


//    @MessageMapping("/message")
//    @SendTo("/chatroom/public")
//    public Message receviePublicMessage(@Payload Message message) {
//        return message;
//    }
//
//    @MessageMapping("/private-message")
//    public Message receviePrivateMessage(@Payload Message message) {
//        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
//        return message;
//    }

}
