package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.Ballot;
import com.kjy.gourmet.service.voting.VotingService;
import com.kjy.gourmet.utils.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final VotingService votingService;

    @GetMapping("/voting/isSessionDuplicated")
    public boolean isSessionDuplicated(Authentication authentication) {
        String userEmail = AuthUtil.extractEmailFromAuth(authentication);
        return votingService.isSessionDuplicated(userEmail);
    }

    @MessageMapping("/voting/register/{userName}/{roomId}")
    public void register(@DestinationVariable String roomId,
                         @DestinationVariable String userName,
                         SimpMessageHeaderAccessor headerAccessor) {
//        String sessionId = headerAccessor.getSessionId();
        String sessionId = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.userRegisterHandler(roomId, sessionId, userName);
        log.info("{}방에 {}님 입장", roomId, userName);
    }

    @MessageMapping("/voting/create/{userName}/{roomId}")
    public void create(@DestinationVariable String roomId) {
        votingService.creatVotingSession(roomId);
        log.info("{}방에 투표세션이 생성되었습니다.", roomId);
    }

    @MessageMapping("/voting/sync/{userName}/{roomId}")
    public void sync(@DestinationVariable String roomId,
                     @DestinationVariable String userName) {
        votingService.syncHandler(roomId, userName);
    }

    @MessageMapping("/voting/cancel/{userName}/{roomId}")
    public void cancel(@DestinationVariable String roomId) {
        votingService.cancelHandler(roomId);
    }

    @MessageMapping("/voting/seating/{userName}/{roomId}")
    public void seating(SimpMessageHeaderAccessor headerAccessor,
                        @DestinationVariable String roomId,
                        @DestinationVariable String userName) {
//        String sessionId = headerAccessor.getSessionId();
        String sessionId = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.userSeatingHandler(roomId, sessionId, userName);
    }

    @MessageMapping("/voting/start/{userName}/{roomId}")
    public void start(@DestinationVariable String roomId,
                      @DestinationVariable String userName) {
        votingService.startVoting(roomId, userName);
    }

    @MessageMapping("/voting/decide/{userName}/{roomId}")
    public void decide(@DestinationVariable String roomId, Ballot ballot) {
        votingService.decidePreference(roomId, ballot);
    }

    @MessageMapping("/voting/finish/{userName}/{roomId}")
    public void finish(@DestinationVariable String roomId,
                       @DestinationVariable String userName,
                       SimpMessageHeaderAccessor headerAccessor) {
//        String sessionId = headerAccessor.getSessionId();
        String sessionId = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.finishVoting(roomId, sessionId, userName);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String sessionId = headerAccessor.getSessionId();
        String sessionId = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.disconnectSession(sessionId);
    }

}
