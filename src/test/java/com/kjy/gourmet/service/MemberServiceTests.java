package com.kjy.gourmet.service;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.service.member.MemberService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class MemberServiceTests {

    @Autowired MemberService memberService;

    @BeforeEach
    public void setUp(){
        Member newbie = Member.builder()
                .email("test1@naver.com")
                .password("123456")
                .nickname("김램지")
                .build();
        int procRes = memberService.signUp(newbie);
        assertThat(procRes).isEqualTo(1);
    }

    @AfterEach
    public void cleanUp(){
        long memId = memberService.getMemberByEmail("test1@naver.com").getId();
        int procRes = memberService.signOut(memId);
        assertThat(procRes).isEqualTo(1);
    }

    @Test
    public void getMemberTest(){
        long memId = memberService.getMemberByEmail("test1@naver.com").getId();
        Member member = memberService.getMemberById(memId);
        assertThat(member.getNickname()).isEqualTo("김램지");
    }
}
