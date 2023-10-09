package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.service.voting.VotingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final VotingService votingService;

    @MessageMapping("/voting/seating/{userName}/{roomId}")
    public void seating(@DestinationVariable String roomId, @DestinationVariable String userName) {
        votingService.memberSeatingHandler(roomId, userName);
    }

    @MessageMapping("/voting/decide/{userName}/{roomId}")
    public void decide(
            @DestinationVariable String roomId,
            Ballot ballot) {
        votingService.decideHandler(roomId, ballot);
    }

    @MessageMapping("/voting/finish/{userName}/{roomId}")
    public void finish(@DestinationVariable String roomId, @DestinationVariable String userName) {
        votingService.finishHandler(roomId, userName);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        // 연결이 끊어졌을 때 실행할 로직을 작성합니다.
        // 예: 연결이 끊긴 세션에 대한 추가 작업 수행

        System.out.println("Session disconnected: " + sessionId);
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
