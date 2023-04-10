package com.kjy.gourmet.mapper;

import com.kjy.gourmet.domain.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface MemberMapper {
    int insertMember(Member member);
    Member selectMemberById(long memberId);
    Member selectMemberByEmail(String email);
    int deleteMemberById(long memberId);
}
