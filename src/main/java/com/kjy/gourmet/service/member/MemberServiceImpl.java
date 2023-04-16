package com.kjy.gourmet.service.member;

import com.kjy.gourmet.domain.member.Member;
import com.kjy.gourmet.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberServiceImpl implements MemberService {

    private final MemberMapper memberMapper;

    @Override
    public int signUp(Member member) {
        return memberMapper.insertMember(member);
    }

    @Override
    public long getMemNoAfterValidation(Member member) {
        Member trueMember = memberMapper.selectMemberByEmail(member.getEmail());
        if(trueMember == null) return 0;
        String inputtedPassword = member.getPassword();
        String truePassword = trueMember.getPassword();
        if(inputtedPassword.equals(truePassword)) return trueMember.getId();
        return -1;
    }

    @Override
    public int signOut(long memberId) {
        return memberMapper.deleteMemberById(memberId);
    }

    @Override
    public Member getMemberById(long memberId) {
        return memberMapper.selectMemberById(memberId);
    }

    @Override
    public Member getMemberByEmail(String email) {
        return memberMapper.selectMemberByEmail(email);
    }
}
