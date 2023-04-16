package com.kjy.gourmet.service.member;

import com.kjy.gourmet.domain.member.Member;

public interface MemberService {
    int signUp(Member member);
    long getMemNoAfterValidation(Member member);
    int signOut(long memberId);
    Member getMemberById(long memberId);
    Member getMemberByEmail(String email);
}
