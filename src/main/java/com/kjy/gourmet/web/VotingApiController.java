package com.kjy.gourmet.web;

import com.kjy.gourmet.config.auth.LoginUser;
import com.kjy.gourmet.config.auth.dto.SessionUser;
import com.kjy.gourmet.domain.menu.Menu;
import com.kjy.gourmet.service.voting.dto.Ballot;
import com.kjy.gourmet.service.voting.VotingService;
import com.kjy.gourmet.utils.AuthUtil;
import com.kjy.gourmet.web.dto.WebSocketUser;
import com.mysql.cj.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final VotingService votingService;

    @GetMapping("/voting/isSessionDuplicated")
    public boolean isSessionDuplicated(@LoginUser SessionUser user) {
        return votingService.isSessionDuplicated(user.getEmail());
    }

    @GetMapping("/voting/isVotingOngoing")
    public boolean isVotingOngoing(@RequestParam long roomId) {
        return votingService.isVotingOngoing(roomId);
    }

    @GetMapping("/voting/getTodayMenuList")
    public List<Menu> getTodayMenuList(@LoginUser SessionUser user) {
        return votingService.getTodayMenuListFromSession(user);
    }

    @MessageMapping("/voting/register")
    public void register(WebSocketUser webSocketUser, SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.userRegisterHandler(userEmail, webSocketUser);
    }

    @MessageMapping("/voting/create/{userId}/{roomId}")
    public void create(@DestinationVariable long roomId,
                       @DestinationVariable long userId,
                       SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.creatVotingSession(userEmail, roomId, userId);
        log.info("{}번 방에 투표세션이 생성되었습니다.", roomId);
    }

    @MessageMapping("/voting/cancel/{roomId}")
    public void cancel(@DestinationVariable long roomId) {
        votingService.cancelHandler(roomId);
    }

    @MessageMapping("/voting/seating/{userId}/{roomId}")
    public void seating(SimpMessageHeaderAccessor headerAccessor,
                        @DestinationVariable long roomId,
                        @DestinationVariable long userId) {
        String userEmail = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.userSeatingHandler(userEmail, roomId, userId);
    }

    @MessageMapping("/voting/start/{roomId}")
    public void start(@DestinationVariable long roomId) {
        votingService.startVoting(roomId);
    }

    @MessageMapping("/voting/decide/{userId}/{roomId}")
    public void decide(@DestinationVariable long roomId, Ballot ballot) {
        votingService.soberDecision(roomId, ballot);
    }

    @MessageMapping("/voting/finish/{roomId}")
    public void finish(@DestinationVariable long roomId,
                       SimpMessageHeaderAccessor headerAccessor) {
        String userEmail = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.finishVoting(userEmail, roomId);
    }

    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = AuthUtil.extractUserEmailFromSimpHeader(headerAccessor);
        votingService.disconnectSession(sessionId);
    }

}
