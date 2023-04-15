package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.domain.room.Room;
import com.kjy.gourmet.mapper.MemberMapper;
import com.kjy.gourmet.mapper.RoomMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
public class RoomTests {

    @Autowired private MemberMapper memberMapper;
    @Autowired private RoomMapper roomMapper;

    List<String> invitationCodes = new ArrayList<>();

    @BeforeEach
    public void setUp(){
        Member newbie = Member.builder()
                .email("test1@naver.com")
                .password("123456")
                .nickname("고든램지")
                .build();
        memberMapper.insertMember(newbie);

        for(int i = 0; i < 2; i++){
            Room room = Room.builder()
                    .name("점심책임방"+i)
                    .invitationCode("123ZXCa"+i)
                    .build();
            roomMapper.insertRoom(room);
            this.invitationCodes.add(room.getInvitationCode());
        }
    }

    @AfterEach
    public void cleanUp(){
        roomMapper.deleteAllRoomFavorites();
        roomMapper.deleteAllRoom();
        long id = memberMapper.selectMemberByEmail("test1@naver.com").getId();
        memberMapper.deleteMemberById(id);
    }

    @Test
    public void selectRoomByCodeTest(){
        Room room = roomMapper.selectRoomByCode("123ZXCa0");
        assertThat(room.getName()).isEqualTo("점심책임방0");
    }

    @Test
    public void insertFavoriteRoomTest(){
        Member member = memberMapper.selectMemberByEmail("test1@naver.com");
        this.invitationCodes.forEach(code -> {
            Room room = roomMapper.selectRoomByCode(code);
            roomMapper.insertFavoriteRoom(member.getId(),room.getId());
        });
        List<Room> favoriteRoomList = roomMapper.selectFavoriteRoomList(member.getId());
        for(int i = 0; i < 2; i++){
            assertThat(favoriteRoomList.get(i).getName()).isEqualTo("점심책임방"+i);
        }
    }
}
