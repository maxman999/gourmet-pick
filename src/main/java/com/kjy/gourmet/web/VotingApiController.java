package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.service.voting.VotingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final VotingService votingService;

    @GetMapping("/voting/room/status/{roomId}")
    public boolean getRoomStatus(@PathVariable("roomId") String roomID) {
        return votingService.getRoomState(roomID);
    }

    @MessageMapping("/voting/seating/{userName}/{roomId}")
    public void seating(
            @DestinationVariable String roomId,
            @DestinationVariable String userName,
            SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        votingService.memberSeatingHandler(roomId, sessionId, userName);
        log.info("{}방에 {}님 입장", roomId, userName);
    }

    @MessageMapping("/voting/decide/{userName}/{roomId}")
    public void decide(
            @DestinationVariable String roomId,
            Ballot ballot) {
        votingService.decidePreference(roomId, ballot);
    }

    @MessageMapping("/voting/finish/{userName}/{roomId}")
    public void finish(
            @DestinationVariable String roomId,
            @DestinationVariable String userName,
            SimpMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();
        votingService.finishVoting(roomId, sessionId, userName);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        votingService.disconnectSession(sessionId);
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
