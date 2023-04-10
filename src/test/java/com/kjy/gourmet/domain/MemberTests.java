package com.kjy.gourmet.domain;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.mapper.MemberMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@SpringBootTest
public class MemberTests {

    @Autowired
    private MemberMapper memberMapper;

    @BeforeEach
    public void setUp(){
        Member newbie = Member.builder()
                .email("test1@naver.com")
                .password("123456")
                .nickname("고든램지")
                .build();
        memberMapper.insertMember(newbie);
    }

    @AfterEach
    public void cleanUp(){
        Member member = memberMapper.selectMemberByEmail("test1@naver.com");
        memberMapper.deleteMemberById(member.getId());
    }

    @Test
    public void selectMemberByEmailTest(){
        Member member = memberMapper.selectMemberByEmail("test1@naver.com");
        assertThat(member.getNickname(),is("고든램지"));
    }
}
