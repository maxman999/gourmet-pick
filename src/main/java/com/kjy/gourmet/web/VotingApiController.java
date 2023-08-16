package com.kjy.gourmet.web;

import com.kjy.gourmet.domain.dto.Message;
import com.kjy.gourmet.domain.dto.Status;
import com.kjy.gourmet.domain.room.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@RestController
public class VotingApiController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private Map<String, HashSet<String>> votingSessions = new ConcurrentHashMap<>();

    @MessageMapping("/voting/join/{username}/{roomId}")
    public void joinRoom(@DestinationVariable String roomId, @DestinationVariable String username) {
        if (votingSessions.containsKey(roomId)) {
            votingSessions.get(roomId).add(username);
        } else {
            HashSet<String> userNames = new HashSet<>();
            userNames.add(username);
            votingSessions.put(roomId, userNames);
        }

        int userCnt = votingSessions.get(roomId).size();
        Message tempMsg = new Message("kjy55", "people", "입장!", "20230816", Status.JOIN, userCnt);
        simpMessagingTemplate.convertAndSend("/voting/" + roomId, tempMsg);
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receviePublicMessage(@Payload Message message) {
        return message;
    }

    @MessageMapping("/private-message")
    public Message receviePrivateMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
        return message;
    }

}
